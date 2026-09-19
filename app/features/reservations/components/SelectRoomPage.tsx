"use client";

import { ReservationProgress, StaticSelect } from "./AvailabilityPage";
import { RoomList } from "@/features/rooms/components/RoomList";

const checkInDays = ["05/Jan", "06/Jan", "07/Jan", "08/Jan", "09/Jan"];
const guests = ["01", "02", "03", "04", "05"];
const nights = ["05", "06", "07", "08", "09"];

export function SelectRoomPage() {
  return (
    <section className="content reservation-main">
      <div className="container">
        <ReservationProgress active={2} />
        <div className="banner-form form-style-1">
          <div className="form-content">
            <StaticSelect label="Check In" values={checkInDays} />
            <StaticSelect label="Check Out" values={checkInDays} />
            <StaticSelect label="Guests" values={guests} />
            <StaticSelect label="Nights" values={nights} />
            <div className="table-item"><div className="form-btn mar-top-35"><a className="btn btn-orange">Check Availability</a></div></div>
          </div>
        </div>
        <RoomList embedded />
      </div>
    </section>
  );
}
