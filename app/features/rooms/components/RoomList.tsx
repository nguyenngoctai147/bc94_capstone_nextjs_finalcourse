"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { EmptyState, LoadingSpinner } from "@/component/ui";
import { routes } from "@/route";
import { fetchLocationDetail } from "@/store/thunk/location";
import { bookingsService } from "@/features/bookings/bookings.service";
import type { Booking } from "@/store/type/bookings";
import { reviewsService } from "@/features/reviews/reviews.service";
import type { Review } from "@/store/type/reviews";
import { nights, type Search } from "@/features/reservations/flow";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchRooms, fetchRoomsByLocation } from "@/store/thunk/room";
import { filterRooms, initialRoomFilters, type RoomFiltersValue, type SortOrder } from "../room-list.utils";
import type { Room } from "@/store/type/room";
import { RoomCatalogueCards, RoomCatalogueShell, type RoomViewMode } from "./RoomCatalogue";
import { RoomCataloguePagination } from "./RoomCataloguePagination";

const PAGE_SIZE = 5;
const EMPTY_ROOMS: readonly Room[] = [];
type RoomListProps = { locationId?: number; search?: Search | null };

export function RoomList({ locationId, search }: RoomListProps) {
  const dispatch = useAppDispatch();
  const catalogue = useAppSelector((state) => state.rooms);
  const locationResult = useAppSelector((state) => state.locationRooms);
  const location = useAppSelector((state) => state.locations.selected);
  const token = useAppSelector((state) => state.auth.token);
  const [filters, setFilters] = useState<RoomFiltersValue>(initialRoomFilters);
  const [sortOrder, setSortOrder] = useState<SortOrder>("recommended");
  const [viewMode, setViewMode] = useState<RoomViewMode>("list");
  const [page, setPage] = useState(1);
  const [reloadCount, setReloadCount] = useState(0);
  const [availability, setAvailability] = useState<{ status: "loading" | "succeeded" | "failed"; items: Booking[] }>({ status: search ? "loading" : "succeeded", items: [] });
  const [reviews, setReviews] = useState<Review[]>([]);
  const [ratingsLoaded, setRatingsLoaded] = useState(false);

  useEffect(() => {
    const roomsTask = locationId === undefined ? dispatch(fetchRooms()) : dispatch(fetchRoomsByLocation(locationId));
    const locationTask = locationId === undefined ? null : dispatch(fetchLocationDetail(locationId));
    return () => { roomsTask.abort(); locationTask?.abort(); };
  }, [dispatch, locationId, reloadCount]);

  useEffect(() => {
    if (!search) return;
    const controller = new AbortController();
    const fetchAvailability = async () => {
      try {
        const result = await bookingsService.list({ token, signal: controller.signal });
        if (!controller.signal.aborted) setAvailability({ status: "succeeded", items: result.data });
      } catch {
        if (!controller.signal.aborted) setAvailability({ status: "failed", items: [] });
      }
    };
    void fetchAvailability();
    return () => controller.abort();
  }, [search, token, reloadCount]);

  useEffect(() => {
    const controller = new AbortController();

    void reviewsService.list({ signal: controller.signal })
      .then((result) => {
        if (!controller.signal.aborted) {
          setReviews(result.data);
          setRatingsLoaded(true);
        }
      })
      .catch(() => {
        if (!controller.signal.aborted) {
          setReviews([]);
          setRatingsLoaded(false);
        }
      });

    return () => controller.abort();
  }, []);

  const request = locationId === undefined ? catalogue.requests.list : locationResult;
  const isCurrent = locationId === undefined || locationResult.locationId === locationId;
  const isLoading = !isCurrent || request.status === "idle" || request.status === "loading" || (request.status !== "failed" && Boolean(search) && availability.status === "loading");
  const sourceRooms = request.status !== "succeeded" || !isCurrent ? EMPTY_ROOMS : locationId === undefined ? catalogue.items : locationResult.items;
  const highestPrice = sourceRooms.reduce((highest, room) => Math.max(highest, room.giaTien), 0);
  const place = location?.id === locationId ? location : null;
  const hasFilters = filters.bedrooms !== "all" || filters.amenities.length > 0 || filters.maxPrice !== null || filters.minRating !== null;
  const hasAvailabilityError = Boolean(search) && availability.status === "failed";
  const ratingsByRoom = useMemo(() => {
    const totals = new Map<number, { total: number; count: number }>();
    reviews.forEach(({ maPhong, saoBinhLuan }) => {
      const current = totals.get(maPhong) ?? { total: 0, count: 0 };
      totals.set(maPhong, { total: current.total + saoBinhLuan, count: current.count + 1 });
    });
    return new Map([...totals].map(([roomId, { total, count }]) => [roomId, total / count]));
  }, [reviews]);
  const rooms = useMemo(() => {
    if (search && availability.status !== "succeeded") return [];
    return filterRooms(sourceRooms, { filters, sortOrder, locationId, search, bookings: availability.items, ratingsByRoom: ratingsLoaded ? ratingsByRoom : undefined });
  }, [sourceRooms, filters, sortOrder, locationId, search, availability, ratingsByRoom, ratingsLoaded]);
  const currentPage = Math.min(page, Math.max(1, Math.ceil(rooms.length / PAGE_SIZE)));
  const offset = (currentPage - 1) * PAGE_SIZE;
  const visibleRooms = rooms.slice(offset, offset + PAGE_SIZE);
  const handleRetry = () => { if (search) setAvailability({ status: "loading", items: [] }); setReloadCount((current) => current + 1); };
  const handleFiltersChange = (nextFilters: RoomFiltersValue) => { setFilters(nextFilters); setPage(1); };
  const handleResetFilters = () => { setFilters(initialRoomFilters); setPage(1); };
  const handleSortChange = (nextSortOrder: SortOrder) => { setSortOrder(nextSortOrder); setPage(1); };
  const getResultsMessage = () => {
    if (isLoading) return "Đang tìm chỗ nghỉ...";
    if (request.status === "failed" || hasAvailabilityError) return "Chưa tải được kết quả";
    if (rooms.length === 0) return "Không có kết quả";
    return `Hiển thị ${offset + 1}–${Math.min(offset + PAGE_SIZE, rooms.length)} trong ${rooms.length} kết quả`;
  };
  const renderRoomList = () => {
    const retryButton = <button type="button" className="btn btn-orange" onClick={handleRetry}>Thử lại</button>;
    if (isLoading) return <div className="location-room-status text-center"><LoadingSpinner label="Đang tải danh sách phòng" /></div>;
    if (request.status === "failed") return <EmptyState title="Không thể tải danh sách phòng" description={request.error?.message} action={retryButton} />;
    if (hasAvailabilityError) return <EmptyState title="Không thể kiểm tra lịch trống" description="Vui lòng thử lại để tìm phòng phù hợp với ngày đã chọn." action={retryButton} />;
    if (visibleRooms.length === 0) return <EmptyState title={sourceRooms.length ? "Không có phòng phù hợp" : "Chưa có phòng"} description={hasFilters ? "Thử xóa bộ lọc để xem thêm chỗ nghỉ." : "Hãy chọn điểm đến hoặc ngày lưu trú khác."} action={hasFilters ? <button type="button" className="btn btn-orange" onClick={handleResetFilters}>Xóa bộ lọc</button> : <Link href={routes.home} className="btn btn-orange">Khám phá điểm đến</Link>} />;
    return <RoomCatalogueCards rooms={visibleRooms} search={search} viewMode={viewMode} />;
  };

  return <RoomCatalogueShell
    header={search ? <div className="list-filter room-search-summary"><p className="mar-0">Nhận phòng: {search.checkIn} · Trả phòng: {search.checkOut} · {search.guests} khách · {nights(search)} đêm</p><Link href={routes.home}>Thay đổi tìm kiếm</Link></div> : undefined}
    title={locationId === undefined ? "Tất cả chỗ nghỉ" : place ? `${place.tenViTri}, ${place.tinhThanh}` : `Chỗ nghỉ tại vị trí #${locationId}`}
    resultMessage={getResultsMessage()} sortOrder={sortOrder} sortDisabled={isLoading || request.status === "failed" || hasAvailabilityError} onSortChange={handleSortChange} viewMode={viewMode} onViewModeChange={setViewMode}
    filters={{ values: filters, highestPrice, disabled: isLoading || request.status === "failed" || hasAvailabilityError, onChange: handleFiltersChange, onReset: handleResetFilters }} busy={isLoading}
    pagination={!isLoading && request.status === "succeeded" && !hasAvailabilityError && rooms.length > PAGE_SIZE ? <RoomCataloguePagination page={currentPage} pageSize={PAGE_SIZE} total={rooms.length} onChange={setPage} /> : undefined}
  >{renderRoomList()}</RoomCatalogueShell>;
}
