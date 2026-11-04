import Link from "next/link";
import { BookingLink } from "@/components/auth/BookingLink";
import { routes } from "@/config/routes";
import { roomAmenities } from "@/features/rooms/room-amenities";
import { RoomAmenityIcon } from "@/features/rooms/components/RoomAmenityIcon";
import type { Room } from "@/features/rooms/rooms.types";
import { withStaySearch, type Search } from "@/features/reservations/flow";
import { ApiImage } from "./ApiImage";

type CardRoomProps = {
  room: Room;
  search?: Search | null;
  variant?: "grid" | "list";
  rating?: number;
};

function RoomRating({ rating }: { rating?: number }) {
  const hasRating = rating !== undefined;
  const normalizedRating = hasRating
    ? Math.max(0, Math.min(5, Math.round(rating)))
    : 0;

  return (
    <div
      className="deal-rating"
      aria-label={
        hasRating ? `Đánh giá ${normalizedRating} trên 5` : "Chưa có đánh giá"
      }
    >
      {Array.from({ length: 5 }, (_, index) => (
        <span
          className={`fa fa-star${index < normalizedRating ? " checked" : ""}`}
          aria-hidden="true"
          key={index}
        />
      ))}
    </div>
  );
}

function RoomServices({ room, className = "" }: { room: Room; className?: string }) {
  const featuredAmenity = roomAmenities.find(({ key }) => room[key]);

  return (
    <div className={`room-services mar-bottom-15 ${className}`}>
      <ul>
        <li>
          <i className="fa fa-bed" aria-hidden="true" /> {room.phongNgu} phòng
          ngủ
        </li>
        {featuredAmenity ? (
          <li>
            <RoomAmenityIcon amenity={featuredAmenity.key} />{" "}
            {featuredAmenity.label}
          </li>
        ) : (
          <li>
            <i className="fa fa-tint" aria-hidden="true" /> {room.phongTam} phòng
            tắm
          </li>
        )}
      </ul>
    </div>
  );
}

export default function CardRoom({
  room,
  search,
  variant = "grid",
  rating,
}: CardRoomProps) {
  const isList = variant === "list";
  const detailHref = withStaySearch(routes.rooms.detail(room.id), search);
  const bookingHref = withStaySearch(
    routes.reservation.forRoom(room.id),
    search,
  );

  return (
    <article className={isList ? "room-grid" : "room-item room-card-static"}>
      <div
        className={
          isList
            ? "grid-image location-room-image"
            : "room-image room-card-static__image"
        }
      >
        <ApiImage
          src={room.hinhAnh}
          width={500}
          height={350}
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          alt={`Phòng ${room.tenPhong}`}
          fallback={
            <div className="room-image-fallback room-card-static__image-fallback">
              Chưa có ảnh phòng
            </div>
          }
        />
      </div>

      <div
        className={isList ? "grid-content" : "room-content room-card-static__content"}
      >
        <div className={`room-title ${isList ? "" : "room-card-static__title"}`}>
          <h4>
            <Link href={detailHref}>{room.tenPhong}</Link>
          </h4>
          <p>${room.giaTien.toLocaleString("vi-VN")}/Đêm</p>
          <RoomRating rating={rating} />
        </div>

        <RoomServices
          room={room}
          className={isList ? "" : "room-card-static__services"}
        />

        <div
          className={
            isList
              ? "grid-btn mar-top-20"
              : "room-btns mar-top-20 room-card-static__actions"
          }
        >
          <Link href={detailHref} className="btn btn-black mar-right-10">
            Xem chi tiết
          </Link>
          <BookingLink href={bookingHref} className="btn btn-orange">
            Đặt ngay
          </BookingLink>
        </div>
      </div>
    </article>
  );
}
