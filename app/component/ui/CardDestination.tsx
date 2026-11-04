import Link from "next/link";
import { routes } from "@/config/routes";
import type { Location } from "@/features/locations/locations.types";
import { ApiImage } from "./ApiImage";

export default function CardDestination({ location }: { location: Location }) {
  return (
    <Link
      href={routes.rooms.byLocation(location.id)}
      className="room-item d-block text-decoration-none"
      aria-label={`Xem phòng tại ${location.tenViTri}, ${location.tinhThanh}`}
    >
      <div className="room-image">
        <ApiImage
          width={500}
          height={250}
          src={location.hinhAnh}
          alt={`Điểm đến ${location.tenViTri}`}
          sizes="(max-width: 760px) 100vw, (max-width: 1000px) 50vw, 33vw"
        />
        <div className="room-content tw-w-full">
          <div className="room-title">
            <h4 className="white">{location.tenViTri}</h4>
            <div className="text white">
              {location.tinhThanh}, {location.quocGia}
            </div>
          </div>
          <div className="room-services mar-top-20">
            <ul>
              <li>
                <span className="btn btn-black">Xem phòng</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </Link>
  );
}
