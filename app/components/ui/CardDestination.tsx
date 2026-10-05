import Link from "next/link";
import Image from "next/image";
import { routes } from "@/config/routes";
import type { Location } from "@/features/locations/locations.types";

export default function CardDestination({ location }: { location: Location }) {
  return (
    <div className="room-item">
      <div className="room-image">
        {location.hinhAnh ? (
          <Image
            width={500}
            height={250}
            src={location.hinhAnh}
            alt={`Điểm đến ${location.tenViTri}`}
            sizes="(max-width: 760px) 100vw, (max-width: 1000px) 50vw, 33vw"
          />
        ) : null}
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
                <Link
                  href={routes.reservation.availability}
                  className="btn btn-black"
                >
                  Xem thêm
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
