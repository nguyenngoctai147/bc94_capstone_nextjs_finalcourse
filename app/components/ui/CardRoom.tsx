/* eslint-disable @next/next/no-img-element */

import Link from "next/link";
import { routes } from "@/config/routes";

export default function CardRoom() {
  return (
    <div className="room-item">
      <div className="room-image">
        <img src="/assets/images/room-b1.jpg" alt="image" />
      </div>
      <div className="room-content">
        <div className="room-title">
          <h4>Super Deluxe</h4>
          <p>$1200/Night</p>
          <div className="deal-rating">
            <span className="fa fa-star checked" />
            <span className="fa fa-star checked" />
            <span className="fa fa-star checked" />
            <span className="fa fa-star checked" />
            <span className="fa fa-star checked" />
          </div>
        </div>
        <div className="room-btns mar-top-20">
          <Link href={routes.rooms.detail(1)} className="btn btn-black mar-right-10">
            VIEW DETAILS
          </Link>
          <Link href={routes.reservation.availability} className="btn btn-orange">
            BOOK NOW
          </Link>
        </div>
      </div>
    </div>
  );
}
