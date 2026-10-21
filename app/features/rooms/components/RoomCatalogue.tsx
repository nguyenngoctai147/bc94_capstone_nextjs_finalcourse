"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { ApiImage } from "@/components/ui/ApiImage";
import { routes } from "@/config/routes";
import type { Search } from "@/features/reservations/flow";
import type { RoomFiltersValue, SortOrder } from "../room-list.utils";
import type { Room } from "../rooms.types";
import { RoomFilters } from "./RoomFilters";
import styles from "./RoomList.module.css";

export type RoomViewMode = "list" | "grid";

type CatalogueFilters = {
  values: RoomFiltersValue;
  highestPrice: number;
  disabled: boolean;
  onChange: (values: RoomFiltersValue) => void;
  onReset: () => void;
};

type RoomCatalogueShellProps = {
  header?: ReactNode;
  title: ReactNode;
  resultMessage: string;
  sortOrder: SortOrder;
  sortDisabled?: boolean;
  onSortChange: (value: SortOrder) => void;
  viewMode: RoomViewMode;
  onViewModeChange: (value: RoomViewMode) => void;
  filters: CatalogueFilters;
  busy?: boolean;
  children: ReactNode;
  pagination?: ReactNode;
};

export function RoomCatalogueShell(props: RoomCatalogueShellProps) {
  const {
    header,
    title,
    resultMessage,
    sortOrder,
    sortDisabled = false,
    onSortChange,
    viewMode,
    onViewModeChange,
    filters,
    busy = false,
    children,
    pagination,
  } = props;

  return (
    <section className={`room-list location-room-list ${styles.catalogue}`}>
      <div className="container">
        {header}
        <div className="row flex-row-reverse">
          <div className="col-lg-9">
            <div className="list-results room-results" aria-live="polite">
              <div className="list-results-sort">
                <h2 className="h5 mar-0">{title}</h2>
                <p className="mar-0 text-muted">{resultMessage}</p>
              </div>
              <div className="click-menu">
                <label className="visually-hidden" htmlFor="sort-rooms">
                  Sắp xếp chỗ nghỉ
                </label>
                <select
                  id="sort-rooms"
                  className="location-room-sort"
                  value={sortOrder}
                  disabled={sortDisabled}
                  onChange={(event) => onSortChange(event.target.value as SortOrder)}
                >
                  <option value="recommended">Đề xuất</option>
                  <option value="price-low">Giá thấp đến cao</option>
                  <option value="price-high">Giá cao đến thấp</option>
                  <option value="capacity">Sức chứa lớn nhất</option>
                </select>
                <div className={`change-list ${viewMode === "list" ? "f-active" : ""}`}>
                  <button
                    type="button"
                    className={styles.viewToggle}
                    aria-label="Hiển thị dạng danh sách"
                    aria-pressed={viewMode === "list"}
                    onClick={() => onViewModeChange("list")}
                  >
                    <i className="fa fa-bars" aria-hidden="true" />
                  </button>
                </div>
                <div className={`change-grid ${viewMode === "grid" ? "f-active" : ""}`}>
                  <button
                    type="button"
                    className={styles.viewToggle}
                    aria-label="Hiển thị dạng lưới"
                    aria-pressed={viewMode === "grid"}
                    onClick={() => onViewModeChange("grid")}
                  >
                    <i className="fa fa-th" aria-hidden="true" />
                  </button>
                </div>
              </div>
            </div>
            <div className="list-content" aria-busy={busy}>
              {children}
            </div>
            {pagination}
          </div>
          <RoomFilters {...filters} />
        </div>
      </div>
    </section>
  );
}

export type RoomPrimaryAction = {
  label: string;
  href?: string;
  onClick?: () => void;
};

type RoomCatalogueCardProps = {
  room: Room;
  search?: Search | null;
  viewMode: RoomViewMode;
  primaryAction?: RoomPrimaryAction;
};

function RoomAction({ action }: { action: RoomPrimaryAction }) {
  if (action.href) {
    return (
      <Link className="btn btn-orange" href={action.href}>
        {action.label}
      </Link>
    );
  }

  return (
    <button type="button" className="btn btn-orange" onClick={action.onClick}>
      {action.label}
    </button>
  );
}

function RoomServices({ room }: { room: Room }) {
  const firstAmenity = room.wifi
    ? "Wi-Fi miễn phí"
    : room.dieuHoa
      ? "Điều hòa"
      : room.bep
        ? "Có bếp"
        : `${room.khach} khách`;

  return (
    <div className="room-services">
      <div className="row">
        <div className="col-sm-6">
          <i className="fa fa-bed" aria-hidden="true" /> {room.phongNgu} phòng ngủ · {room.giuong} giường
        </div>
        <div className="col-sm-6">
          <i className="fa fa-user" aria-hidden="true" /> Tối đa {room.khach} khách · {firstAmenity}
        </div>
      </div>
    </div>
  );
}

export function RoomCatalogueCard(props: RoomCatalogueCardProps) {
  const { room, search, viewMode, primaryAction } = props;
  const detailHref = search
    ? `${routes.rooms.detail(room.id)}?checkIn=${search.checkIn}&checkOut=${search.checkOut}&guests=${search.guests}`
    : routes.rooms.detail(room.id);
  const action = primaryAction ?? { label: "Đặt ngay", href: detailHref };
  const image = (
    <ApiImage
      src={room.hinhAnh}
      alt={room.tenPhong}
      width={640}
      height={440}
      className="w-100 h-auto"
      sizes={viewMode === "grid" ? "(max-width: 767px) 100vw, (max-width: 1199px) 50vw, 33vw" : "(max-width: 767px) 100vw, 40vw"}
      fallback={<div className="location-room-image-fallback">Chưa có ảnh phòng</div>}
    />
  );

  if (viewMode === "grid") {
    return (
      <article className="room-item">
        <div className="room-image">{image}</div>
        <div className="room-content">
          <h3><Link href={detailHref}>{room.tenPhong}</Link></h3>
          <p className="h5">${room.giaTien.toLocaleString("vi-VN")} <small>/ đêm</small></p>
          <RoomServices room={room} />
          <div className="grid-btn mar-top-20">
            <Link className="btn btn-black" href={detailHref}>Xem chi tiết</Link>
            <RoomAction action={action} />
          </div>
        </div>
      </article>
    );
  }

  return (
    <article className="room-grid">
      <div className="grid-image location-room-image">{image}</div>
      <div className="grid-content">
        <div className="room-title">
          <h3><Link href={detailHref}>{room.tenPhong}</Link></h3>
          <p className="mar-0">${room.giaTien.toLocaleString("vi-VN")} <small>/ đêm</small></p>
        </div>
        <div className="room-detail">
          <p>{room.moTa || "Không gian lưu trú tiện nghi, phù hợp cho chuyến đi của bạn."}</p>
        </div>
        <RoomServices room={room} />
        <div className="grid-btn mar-top-20">
          <Link className="btn btn-black" href={detailHref}>Xem chi tiết</Link>
          <RoomAction action={action} />
        </div>
      </div>
    </article>
  );
}

type RoomCatalogueCardsProps = {
  rooms: readonly Room[];
  search?: Search | null;
  viewMode: RoomViewMode;
  getPrimaryAction?: (room: Room) => RoomPrimaryAction;
};

export function RoomCatalogueCards(props: RoomCatalogueCardsProps) {
  const { rooms, search, viewMode, getPrimaryAction } = props;
  const renderCard = (room: Room) => (
    <RoomCatalogueCard
      key={room.id}
      room={room}
      search={search}
      viewMode={viewMode}
      primaryAction={getPrimaryAction?.(room)}
    />
  );

  if (viewMode === "list") return <div className="list-grid">{rooms.map(renderCard)}</div>;

  return <div className="row">{rooms.map((room) => <div className="col-md-6 mar-bottom-30" key={room.id}>{renderCard(room)}</div>)}</div>;
}
