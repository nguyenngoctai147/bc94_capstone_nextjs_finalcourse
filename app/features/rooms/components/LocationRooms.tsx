"use client";

import Link from "next/link";
import { Fragment, useEffect, useMemo, useState } from "react";
import { ApiImage } from "@/components/ui/ApiImage";
import { EmptyState } from "@/components/ui/EmptyState";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { routes } from "@/config/routes";
import { locationsThunks } from "@/features/locations/locations.thunks";
import { bookingsThunks } from "@/features/bookings/bookings.thunks";
import type { Booking } from "@/features/bookings/bookings.types";
import { available, nights, withStaySearch, type Search } from "@/features/reservations/flow";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { roomsThunks } from "../rooms.thunks";
import type { Room } from "../rooms.types";

const PAGE_SIZE = 5;

type SortOrder = "recommended" | "price-low" | "price-high" | "capacity";
type BedroomFilter = "all" | "one" | "two" | "three-plus";
type AmenityKey = "wifi" | "hoBoi" | "doXe" | "bep" | "mayGiat" | "tivi";

const BEDROOM_FILTERS: { value: BedroomFilter; label: string }[] = [
  { value: "all", label: "Tất cả loại phòng" },
  { value: "one", label: "1 phòng ngủ" },
  { value: "two", label: "2 phòng ngủ" },
  { value: "three-plus", label: "Từ 3 phòng ngủ" },
];

const AMENITIES: { key: AmenityKey; label: string }[] = [
  { key: "wifi", label: "Wi-Fi" },
  { key: "hoBoi", label: "Hồ bơi" },
  { key: "doXe", label: "Chỗ đỗ xe" },
  { key: "bep", label: "Bếp" },
  { key: "mayGiat", label: "Máy giặt" },
  { key: "tivi", label: "TV" },
];

function visiblePages(page: number, count: number) {
  if (count <= 5) return Array.from({ length: count }, (_, index) => index + 1);
  const candidates = [1, page - 1, page, page + 1, count];
  return [...new Set(candidates.filter((item) => item >= 1 && item <= count))].sort((a, b) => a - b);
}

function matchesBedrooms(room: Room, filter: BedroomFilter) {
  if (filter === "one") return room.phongNgu === 1;
  if (filter === "two") return room.phongNgu === 2;
  if (filter === "three-plus") return room.phongNgu >= 3;
  return true;
}

export function LocationRooms({ locationId, search }: { locationId: number; search?: Search | null }) {
  const dispatch = useAppDispatch();
  const location = useAppSelector((state) => state.locations.selected);
  const result = useAppSelector((state) => state.locationRooms);
  const [sortOrder, setSortOrder] = useState<SortOrder>("recommended");
  const [bedrooms, setBedrooms] = useState<BedroomFilter>("all");
  const [amenities, setAmenities] = useState<AmenityKey[]>([]);
  const [priceLimit, setPriceLimit] = useState<number | null>(null);
  const [page, setPage] = useState(1);
  const [availability, setAvailability] = useState<{ status: "loading" | "succeeded" | "failed"; items: Booking[] }>({ status: search ? "loading" : "succeeded", items: [] });
  const [availabilityAttempt, setAvailabilityAttempt] = useState(0);

  useEffect(() => {
    if (!search) return;
    let active = true;
    const task = dispatch(bookingsThunks.list());
    void task.unwrap().then((response) => {
      if (active) setAvailability({ status: "succeeded", items: response.data });
    }).catch(() => {
      if (active) setAvailability({ status: "failed", items: [] });
    });
    return () => { active = false; task.abort(); };
  }, [dispatch, search, availabilityAttempt]);

  useEffect(() => {
    const locationTask = dispatch(locationsThunks.detail(locationId));
    const roomsTask = dispatch(roomsThunks.byLocation(locationId));
    return () => {
      locationTask.abort();
      roomsTask.abort();
    };
  }, [dispatch, locationId]);

  const isCurrentResult = result.locationId === locationId;
  const isLoading = !isCurrentResult || result.status === "idle" || result.status === "loading" || (Boolean(search) && availability.status === "loading");
  const place = location?.id === locationId ? location : null;
  const sourceRooms = useMemo(() => {
    if (!isCurrentResult || result.status !== "succeeded") return [];
    return result.items.filter((room) => room.maViTri === locationId);
  }, [isCurrentResult, locationId, result.items, result.status]);
  const highestPrice = Math.max(0, ...sourceRooms.map((room) => room.giaTien));
  const activePriceLimit = priceLimit ?? highestPrice;

  const rooms = useMemo(() => {
    const filtered = sourceRooms.filter((room) =>
      (!search || (availability.status === "succeeded" && available(room, search, availability.items))) &&
      matchesBedrooms(room, bedrooms) &&
      room.giaTien <= activePriceLimit &&
      amenities.every((key) => room[key] === true));

    if (sortOrder === "price-low") filtered.sort((a, b) => a.giaTien - b.giaTien);
    if (sortOrder === "price-high") filtered.sort((a, b) => b.giaTien - a.giaTien);
    if (sortOrder === "capacity") filtered.sort((a, b) => b.khach - a.khach);
    return filtered;
  }, [activePriceLimit, amenities, bedrooms, sortOrder, sourceRooms, search, availability]);

  const pageCount = Math.max(1, Math.ceil(rooms.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const firstResult = rooms.length === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1;
  const lastResult = Math.min(currentPage * PAGE_SIZE, rooms.length);
  const visibleRooms = rooms.slice(firstResult === 0 ? 0 : firstResult - 1, lastResult);

  const changeAmenity = (key: AmenityKey, checked: boolean) => {
    setAmenities((current) => checked ? [...current, key] : current.filter((item) => item !== key));
    setPage(1);
  };

  const resetFilters = () => {
    setBedrooms("all");
    setAmenities([]);
    setPriceLimit(null);
    setPage(1);
  };

  return (
    <section className="room-list location-room-list">
      <div className="container">
        {search && <div className="list-filter">
          <p className="mar-0">Nhận phòng: {search.checkIn} · Trả phòng: {search.checkOut} · {search.guests} khách · {nights(search)} đêm</p>
          <Link href={routes.home}>Thay đổi tìm kiếm</Link>
        </div>}
        <div className="row flex-row-reverse">
          <div className="col-lg-9">
            <div className="list-results">
              <div className="list-results-sort pad-top-5">
                <h3 className="h5 mar-0">
                  {place ? `${place.tenViTri}, ${place.tinhThanh}` : `Vị trí #${locationId}`}
                </h3>
                <p className="mar-0 text-muted">
                  {isLoading ? "Đang tìm chỗ nghỉ..." : `Hiển thị ${firstResult}-${lastResult} trong ${rooms.length} kết quả`}
                </p>
              </div>
              <div className="click-menu">
                <label className="visually-hidden" htmlFor="sort-location-rooms">Sắp xếp phòng</label>
                <select
                  id="sort-location-rooms"
                  className="form-select location-room-sort"
                  value={sortOrder}
                  onChange={(event) => {
                    setSortOrder(event.target.value as SortOrder);
                    setPage(1);
                  }}
                >
                  <option value="recommended">Đề xuất</option>
                  <option value="price-low">Giá thấp đến cao</option>
                  <option value="price-high">Giá cao đến thấp</option>
                  <option value="capacity">Sức chứa lớn nhất</option>
                </select>
                <div className="change-list f-active mar-left-10" aria-hidden="true">
                  <span><i className="fa fa-bars" /></span>
                </div>
                <div className="change-grid" aria-hidden="true">
                  <span><i className="fa fa-th" /></span>
                </div>
              </div>
            </div>

            <div className="list-content">
              <div className="list-grid">
                {isLoading ? (
                  <div className="location-room-status text-center">
                    <LoadingSpinner label="Đang tải phòng theo vị trí" />
                    <p className="text-muted mar-top-15">Đang tải phòng theo vị trí...</p>
                  </div>
                ) : result.status === "failed" ? (
                  <EmptyState
                    title="Không thể tải phòng tại điểm đến này"
                    description={result.error?.message}
                    action={
                      <button type="button" className="btn btn-orange" onClick={() => { void dispatch(roomsThunks.byLocation(locationId)); }}>
                        Thử lại
                      </button>
                    }
                  />
                ) : search && availability.status === "failed" ? (
                  <EmptyState title="Không thể kiểm tra lịch trống" description="Vui lòng thử lại để xác định phòng phù hợp với ngày đã chọn."
                    action={<button type="button" className="btn btn-orange" onClick={() => { setAvailability({ status: "loading", items: [] }); setAvailabilityAttempt((count) => count + 1); }}>Thử lại</button>} />
                ) : visibleRooms.length === 0 ? (
                  <EmptyState
                    title={sourceRooms.length === 0 ? "Chưa có phòng tại điểm đến này" : "Không có phòng phù hợp"}
                    description={sourceRooms.length === 0 ? "Hãy chọn một vị trí khác để xem thêm chỗ nghỉ." : "Hãy thay đổi bộ lọc, ngày lưu trú hoặc số khách để xem thêm phòng."}
                    action={sourceRooms.length === 0
                      ? <Link href={routes.home} className="btn btn-orange">Khám phá điểm đến</Link>
                      : <button type="button" className="btn btn-orange" onClick={resetFilters}>Xóa bộ lọc</button>}
                  />
                ) : visibleRooms.map((room) => <LocationRoomCard key={room.id} room={room} search={search} />)}
              </div>
            </div>

            {!isLoading && result.status === "succeeded" && rooms.length > PAGE_SIZE && (
              <nav className="pagination-content text-center" aria-label="Phân trang danh sách phòng">
                <ul className="pagination">
                  <li className={`page-item${currentPage === 1 ? " disabled" : ""}`}>
                    <a href="#" className="page-link" aria-label="Trang đầu" onClick={(event) => { event.preventDefault(); setPage(1); }}>
                      <i className="fa fa-angle-double-left" aria-hidden="true" />
                    </a>
                  </li>
                  {visiblePages(currentPage, pageCount).map((item, index, pages) => (
                    <Fragment key={item}>
                      {index > 0 && item - pages[index - 1] > 1 && (
                        <li className="page-item disabled"><span className="page-link">...</span></li>
                      )}
                      <li className={`page-item${currentPage === item ? " active" : ""}`}>
                        <a href="#" className="page-link" aria-current={currentPage === item ? "page" : undefined} onClick={(event) => { event.preventDefault(); setPage(item); }}>
                          {item}
                        </a>
                      </li>
                    </Fragment>
                  ))}
                  <li className={`page-item${currentPage === pageCount ? " disabled" : ""}`}>
                    <a href="#" className="page-link" aria-label="Trang cuối" onClick={(event) => { event.preventDefault(); setPage(pageCount); }}>
                      <i className="fa fa-angle-double-right" aria-hidden="true" />
                    </a>
                  </li>
                </ul>
              </nav>
            )}
          </div>

          <aside className="col-lg-3 sidebar" aria-label="Bộ lọc phòng">
            <div className="list-sidebar">
              <div className="room-type list-sidebar-item">
                <h4>Loại phòng</h4>
                {BEDROOM_FILTERS.map(({ value, label }, index) => (
                  <div className={`pretty p-default p-thick p-pulse${index === BEDROOM_FILTERS.length - 1 ? "" : " mar-bottom-15"}`} key={value}>
                    <input
                      id={`bedrooms-${value}`}
                      type="radio"
                      name="bedroom-filter"
                      checked={bedrooms === value}
                      onChange={() => { setBedrooms(value); setPage(1); }}
                    />
                    <div className="state p-warning-o"><label htmlFor={`bedrooms-${value}`}>{label}</label></div>
                  </div>
                ))}
              </div>

              {highestPrice > 0 && (
                <div className="price list-sidebar-item">
                  <h4>Khoảng giá</h4>
                  <div className="range-slider">
                    <input
                      className="form-range"
                      type="range"
                      min="0"
                      max={highestPrice}
                      step={Math.max(1, Math.round(highestPrice / 100))}
                      value={activePriceLimit}
                      aria-label="Giá phòng tối đa"
                      onChange={(event) => { setPriceLimit(Number(event.target.value)); setPage(1); }}
                    />
                    <div className="d-flex justify-content-between">
                      <span>0 $</span>
                      <strong>{activePriceLimit.toLocaleString("vi-VN")} $</strong>
                    </div>
                  </div>
                </div>
              )}

              <div className="services list-sidebar-item">
                <h4>Tiện nghi</h4>
                {AMENITIES.map(({ key, label }, index) => (
                  <div className={`pretty p-default p-thick p-pulse${index === AMENITIES.length - 1 ? "" : " mar-bottom-15"}`} key={key}>
                    <input
                      id={`amenity-${key}`}
                      type="checkbox"
                      checked={amenities.includes(key)}
                      onChange={(event) => changeAmenity(key, event.target.checked)}
                    />
                    <div className="state p-warning-o"><label htmlFor={`amenity-${key}`}>{label}</label></div>
                  </div>
                ))}
              </div>

              <div className="info-1 list-sidebar-item">
                <i className="fa fa-map-marker" aria-hidden="true" />
                <h5>Muốn đổi điểm đến?</h5>
                <Link href={routes.home} className="btn btn-orange">Chọn vị trí khác</Link>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}

function LocationRoomCard({ room, search }: { room: Room; search?: Search | null }) {
  const service = room.wifi ? "Wi-Fi miễn phí" : room.dieuHoa ? "Điều hòa" : "Phục vụ nhanh";

  return (
    <article className="room-grid">
      <div className="grid-image location-room-image">
        <ApiImage
          src={room.hinhAnh}
          width={700}
          height={520}
          sizes="(max-width: 767px) 100vw, (max-width: 991px) 40vw, 32vw"
          alt={`Phòng ${room.tenPhong}`}
          fallback={<div className="location-room-image-fallback"><i className="fa fa-picture-o" aria-hidden="true" /><span>Chưa có ảnh phòng</span></div>}
        />
      </div>
      <div className="grid-content">
        <div className="room-title">
          <h4>{room.tenPhong}</h4>
          <p className="mar-top-5"><i className="fa fa-tag" aria-hidden="true" /> {room.giaTien.toLocaleString("vi-VN")} $/đêm</p>
        </div>
        <div className="room-detail"><p>{room.moTa || "Không gian nghỉ dưỡng tiện nghi, phù hợp cho chuyến đi của bạn."}</p></div>
        <div className="room-services">
          <div className="row">
            <div className="col-md-6 col-sm-6 col-xs-6"><i className="fa fa-bed" aria-hidden="true" /> {room.phongNgu} phòng ngủ</div>
            <div className="col-md-6 col-sm-6 col-xs-6"><i className="fa fa-wifi" aria-hidden="true" /> {service}</div>
          </div>
        </div>
        <p className="location-room-capacity mar-0"><i className="fa fa-users" aria-hidden="true" /> Tối đa {room.khach} khách · {room.giuong} giường · {room.phongTam} phòng tắm</p>
        <div className="grid-btn mar-top-20">
          <Link href={withStaySearch(routes.rooms.detail(room.id), search)} className="btn btn-black mar-right-10">Xem chi tiết</Link>
          <Link href={withStaySearch(routes.reservation.forRoom(room.id), search)} className="btn btn-orange">Đặt ngay</Link>
        </div>
      </div>
    </article>
  );
}
