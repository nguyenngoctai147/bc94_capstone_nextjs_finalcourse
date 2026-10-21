"use client";
/* eslint-disable react-hooks/set-state-in-effect -- Hydrate reservation state from sessionStorage on mount. */

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { EmptyState, LoadingSpinner } from "@/components/ui";
import { routes } from "@/config/routes";
import { bookingsService } from "@/features/bookings/bookings.service";
import type { Booking } from "@/features/bookings/bookings.types";
import { RoomCatalogueCards, RoomCatalogueShell, type RoomViewMode } from "@/features/rooms/components/RoomCatalogue";
import { RoomCataloguePagination } from "@/features/rooms/components/RoomCataloguePagination";
import { filterRooms, initialRoomFilters, type RoomFiltersValue, type SortOrder } from "@/features/rooms/room-list.utils";
import { roomsService } from "@/features/rooms/rooms.service";
import type { Room } from "@/features/rooms/rooms.types";
import { available, flowKeys, nights, readSession, type Search, validSearch } from "../flow";
import { ReservationProgress } from "./ReservationUi";

const PAGE_SIZE = 5;

export function SelectRoomPage() {
  const router = useRouter();
  const [search, setSearch] = useState<Search | null>(null);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filters, setFilters] = useState<RoomFiltersValue>(initialRoomFilters);
  const [sortOrder, setSortOrder] = useState<SortOrder>("recommended");
  const [viewMode, setViewMode] = useState<RoomViewMode>("list");
  const [page, setPage] = useState(1);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedSearch = readSession<Search>(flowKeys.search);
    if (!savedSearch || !validSearch(savedSearch)) {
      router.replace(routes.reservation.availability);
      return;
    }
    const controller = new AbortController();
    setSearch(savedSearch);
    const roomRequest = savedSearch.roomId
      ? roomsService.detail(savedSearch.roomId, { signal: controller.signal }).then((room) => [room])
      : savedSearch.locationId
        ? roomsService.byLocation(savedSearch.locationId, { signal: controller.signal })
        : roomsService.list({ signal: controller.signal }).then((response) => response.data);
    void Promise.all([roomRequest, bookingsService.list({ signal: controller.signal })])
      .then(([matchingRooms, bookingsPage]) => {
        if (!controller.signal.aborted) { setRooms(matchingRooms); setBookings(bookingsPage.data); }
      })
      .catch(() => { if (!controller.signal.aborted) setError("Không thể kiểm tra phòng trống. Vui lòng thử lại."); })
      .finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [router]);

  const openRooms = useMemo(() => search ? rooms.filter((room) => available(room, search, bookings)) : [], [rooms, search, bookings]);
  const highestPrice = openRooms.reduce((highest, room) => Math.max(highest, room.giaTien), 0);
  const filteredRooms = useMemo(() => filterRooms(openRooms, { filters, sortOrder, bookings: [] }), [openRooms, filters, sortOrder]);
  const currentPage = Math.min(page, Math.max(1, Math.ceil(filteredRooms.length / PAGE_SIZE)));
  const offset = (currentPage - 1) * PAGE_SIZE;
  const visibleRooms = filteredRooms.slice(offset, offset + PAGE_SIZE);
  const hasFilters = filters.bedrooms !== "all" || filters.amenities.length > 0 || filters.maxPrice !== null;
  const handleFiltersChange = (nextFilters: RoomFiltersValue) => { setFilters(nextFilters); setPage(1); };
  const handleResetFilters = () => { setFilters(initialRoomFilters); setPage(1); };
  const handleSortChange = (nextSortOrder: SortOrder) => { setSortOrder(nextSortOrder); setPage(1); };
  const handleSelectRoom = (room: Room) => {
    if (!search) return;
    sessionStorage.setItem(flowKeys.draft, JSON.stringify({ ...search, room }));
    router.push(routes.reservation.booking);
  };

  if (!search) return null;
  const getResultsMessage = () => {
    if (loading) return "Đang kiểm tra phòng trống...";
    if (error) return "Chưa tải được kết quả";
    if (filteredRooms.length === 0) return "Không có phòng phù hợp";
    return `Hiển thị ${offset + 1}–${Math.min(offset + PAGE_SIZE, filteredRooms.length)} trong ${filteredRooms.length} phòng còn trống`;
  };
  const renderRooms = () => {
    if (loading) return <div className="location-room-status text-center"><LoadingSpinner label="Đang kiểm tra phòng trống" /></div>;
    if (error) return <EmptyState title="Không thể kiểm tra phòng trống" description={error} />;
    if (visibleRooms.length === 0) return <EmptyState title="Không có phòng phù hợp" description={hasFilters ? "Thử xóa bộ lọc để xem thêm phòng trống." : "Hãy thay đổi ngày lưu trú hoặc điểm đến."} action={hasFilters ? <button type="button" className="btn btn-orange" onClick={handleResetFilters}>Xóa bộ lọc</button> : undefined} />;
    return <RoomCatalogueCards rooms={visibleRooms} search={search} viewMode={viewMode} getPrimaryAction={(room) => ({ label: "Chọn phòng", onClick: () => handleSelectRoom(room) })} />;
  };

  return <RoomCatalogueShell
    header={<><ReservationProgress active={2} /><div className="section-title text-start mar-bottom-30"><h2>Phòng <span>còn trống</span></h2><p>{search.checkIn} → {search.checkOut} · {search.guests} khách · {nights(search)} đêm</p></div></>}
    title="Chọn chỗ nghỉ" resultMessage={getResultsMessage()} sortOrder={sortOrder} sortDisabled={loading || Boolean(error)} onSortChange={handleSortChange} viewMode={viewMode} onViewModeChange={setViewMode}
    filters={{ values: filters, highestPrice, disabled: loading || Boolean(error), onChange: handleFiltersChange, onReset: handleResetFilters }} busy={loading}
    pagination={!loading && !error && filteredRooms.length > PAGE_SIZE ? <RoomCataloguePagination page={currentPage} pageSize={PAGE_SIZE} total={filteredRooms.length} onChange={setPage} /> : undefined}
  >{renderRooms()}</RoomCatalogueShell>;
}
