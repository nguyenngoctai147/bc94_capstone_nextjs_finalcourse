import Image from "next/image";
import Link from "next/link";
import { routes } from "@/config/routes";

export default function CardDestination() {
  return (
    <div className="room-item">
      <div className="room-image">
        <Image
          src="/assets/images/room-b1.jpg"
          width={400}
          height={300}
          alt="image"
        />
        <div className="room-content">
          <div className="room-title">
            <h4 className="white">Super Deluxe</h4>
            <div className="text white">
              Lorem ipsum dolor sit amet constur adip isicing elit sed do
              eiusmtem por incid.
            </div>
          </div>
          <div className="room-services mar-top-20">
            <ul>
              <li>
                <Link href={routes.reservation.availability} className="btn btn-black">
                  BOOK NOW
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
