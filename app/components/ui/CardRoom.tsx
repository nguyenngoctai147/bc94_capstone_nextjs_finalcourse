import Link from "next/link";
import Image from "next/image";
import { routes } from "@/config/routes";
import type { Room } from "@/features/rooms/rooms.types";

export default function CardRoom({ room }: { room: Room }) {
  return (
    <div className="room-item">
      <div className="room-image">
        {room.hinhAnh ? (
          <Image
            src={room.hinhAnh}
            width={500}
            height={350}
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            alt={`Phòng ${room.tenPhong}`}
          />
        ) : null}
      </div>
      <div className="room-content">
        <div className="room-title">
          <h4>{room.tenPhong}</h4>
          <p>${room.giaTien}</p>
        </div>
        <div className="room-btns mar-top-20">
          <Link
            href={routes.rooms.detail(room.id)}
            className="btn btn-black mar-right-10"
          >
            Xem chi tiết
          </Link>
          <Link
            href={routes.reservation.availability}
            className="btn btn-orange"
          >
            Đặt
          </Link>
        </div>
      </div>
    </div>
  );
}
