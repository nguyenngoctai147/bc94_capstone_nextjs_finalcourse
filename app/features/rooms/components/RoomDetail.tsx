"use client";

import Link from "next/link";
import { useEffect } from "react";
import { ApiImage } from "@/components/ui/ApiImage";
import { EmptyState } from "@/components/ui/EmptyState";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { routes } from "@/config/routes";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { roomsThunks } from "../rooms.thunks";
import type { Room } from "../rooms.types";
import { withStaySearch, type Search } from "@/features/reservations/flow";

const amenities: { key: keyof Room; label: string; icon: string }[] = [
  { key: "wifi", label: "Wi-Fi", icon: "fa-wifi" },
  { key: "dieuHoa", label: "Điều hòa", icon: "fa-snowflake-o" },
  { key: "bep", label: "Bếp", icon: "fa-cutlery" },
  { key: "mayGiat", label: "Máy giặt", icon: "fa-tint" },
  { key: "tivi", label: "TV", icon: "fa-television" },
  { key: "doXe", label: "Chỗ đỗ xe", icon: "fa-car" },
  { key: "hoBoi", label: "Hồ bơi", icon: "fa-life-ring" },
  { key: "banLa", label: "Bàn là", icon: "fa-check" },
  { key: "banUi", label: "Bàn ủi", icon: "fa-check" },
];

export function RoomDetail({ id, search }: { id: number; search?: Search | null }) {
  const dispatch = useAppDispatch();
  const { selected, requests } = useAppSelector((state) => state.rooms);
  const request = requests.detail;
  const room = request.status === "succeeded" && selected?.id === id ? selected : null;

  useEffect(() => {
    const task = dispatch(roomsThunks.detail(id));
    return () => task.abort();
  }, [dispatch, id]);

  if (request.status === "failed") {
    return (
      <section className="content ds-content">
        <div className="container">
          <EmptyState
            title="Không thể tải thông tin phòng"
            description={request.error?.message}
            action={
              <button type="button" className="btn btn-orange" onClick={() => { void dispatch(roomsThunks.detail(id)); }}>
                Thử lại
              </button>
            }
          />
        </div>
      </section>
    );
  }

  if (!room) {
    return (
      <section className="content ds-content">
        <div className="container text-center py-5">
          <LoadingSpinner label="Đang tải thông tin phòng" />
        </div>
      </section>
    );
  }

  const availableAmenities = amenities.filter(({ key }) => room[key] === true);

  return (
    <section className="content ds-content">
      <div className="container">
        <Link href={withStaySearch(routes.rooms.byLocation(room.maViTri), search)} className="d-inline-block mb-3">
          <i className="fa fa-angle-left" aria-hidden="true" /> Xem các phòng cùng vị trí
        </Link>
        <div className="row g-4">
          <div className="col-lg-7">
            <ApiImage
              src={room.hinhAnh}
              width={1200}
              height={800}
              sizes="(max-width: 992px) 100vw, 60vw"
              alt={`Phòng ${room.tenPhong}`}
              className="w-100 h-auto rounded"
              priority
              fallback={
                <div className="d-flex align-items-center justify-content-center bg-light text-muted rounded" style={{ minHeight: 320 }}>
                  Chưa có ảnh phòng
                </div>
              }
            />
          </div>
          <div className="col-lg-5">
            <h1 className="h2">{room.tenPhong}</h1>
            <p className="text-muted">{room.khach} khách · {room.phongNgu} phòng ngủ · {room.giuong} giường · {room.phongTam} phòng tắm</p>
            <p className="h3 mb-4">${room.giaTien.toLocaleString("vi-VN")} <small className="fs-6 text-muted">/ đêm</small></p>
            <Link href={withStaySearch(routes.reservation.forRoom(room.id), search)} className="btn btn-orange">
              {search ? "Đặt phòng với ngày đã chọn" : "Chọn ngày để đặt phòng này"}
            </Link>
          </div>
        </div>

        {room.moTa && (
          <div className="mt-5">
            <h2 className="h4">Thông tin phòng</h2>
            <p className="text-muted" style={{ whiteSpace: "pre-line" }}>{room.moTa}</p>
          </div>
        )}
        {availableAmenities.length > 0 && (
          <div className="mt-4">
            <h2 className="h4">Tiện nghi</h2>
            <ul className="row list-unstyled g-3">
              {availableAmenities.map(({ key, label, icon }) => (
                <li className="col-sm-6 col-lg-4" key={key}>
                  <i className={`fa ${icon} me-2`} aria-hidden="true" />{label}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}
