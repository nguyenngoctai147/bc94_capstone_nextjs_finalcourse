import Link from "next/link";
import { routes } from "@/config/routes";
import type { Room } from "@/features/rooms/rooms.types";
import { ApiImage } from "./ApiImage";

export default function CardRoom({ room }: { room: Room }) {
  return (
    <div className="room-item">
      <div className="room-image">
        <ApiImage
          src={room.hinhAnh}
          width={500}
          height={350}
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          alt={`Phòng ${room.tenPhong}`}
          fallback={
            <div className="d-flex align-items-center justify-content-center bg-light text-muted" style={{ minHeight: 220 }}>
              Chưa có ảnh phòng
            </div>
          }
        />
      </div>
      <div className="room-content">
        <div className="room-title">
          <h4>{room.tenPhong}</h4>
          <p>${room.giaTien.toLocaleString("vi-VN")} / đêm</p>
        </div>
        <p className="mb-2">{room.khach} khách · {room.phongNgu} phòng ngủ · {room.giuong} giường</p>
        <div className="room-btns mar-top-20">
          <Link
            href={routes.rooms.detail(room.id)}
            className="btn btn-black mar-right-10"
          >
            Xem chi tiết
          </Link>
          <Link
            href={routes.reservation.forRoom(room.id)}
            className="btn btn-orange"
          >
            Chọn ngày để đặt
          </Link>
        </div>
      </div>
    </div>
  );
}
