"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { flowKeys, today, validSearch } from "../flow";
import { routes } from "@/config/routes";

const checkInDays = ["05/Jan", "06/Jan", "07/Jan", "08/Jan", "09/Jan"];
const guests = ["01", "02", "03", "04", "05"];
const nights = ["05", "06", "07", "08", "09"];

export function ReservationProgress({ active }: { active: 1 | 2 | 3 | 4 }) {
  const steps = [
    ["Check Availability", routes.reservation.availability],
    ["Select Room", routes.reservation.selectRoom],
    ["Booking", routes.reservation.booking],
    ["Confirmation", routes.reservation.confirmation],
  ] as const;
  return (
    <div className="reservation-links text-center">
      <h2 className="mar-bottom-60 text-capitalize">Make Your Reservation</h2>
      <div className="reservation-links-content">
        {steps.map(([label, href], index) => {
          const step = index + 1;
          return (
            <div className="res-item" key={label}>
              <Link href={href} className={step <= active ? "active" : undefined}>
                {step < active ? <i className="fa fa-check" /> : step}
              </Link>
              <p>{label}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function StepLink({
  number,
  label,
  href,
  active = false,
}: {
  number: string;
  label: string;
  href: string;
  active?: boolean;
}) {
  return (
    <div className="res-item">
      <Link href={href} className={active ? "active" : undefined}>{number}</Link>
      <p>{label}</p>
    </div>
  );
}

export function StaticSelect({
  label,
  values,
}: {
  label: string;
  values: readonly string[];
}) {
  return (
    <div className="table-item">
      <label>{label}</label>
      <div className="form-group">
        <select className="wide" defaultValue="1">
          {values.map((value, index) => <option value={String(index + 1)} key={value}>{value}</option>)}
        </select>
      </div>
    </div>
  );
}

export function AvailabilityPage() {
  const router = useRouter();
  const [checkIn,setCheckIn]=useState(""); const [checkOut,setCheckOut]=useState(""); const [guests,setGuests]=useState(1); const [error,setError]=useState("");

  return (
    <section className="content reservation-main">
      <div className="container">
        <ReservationProgress active={1} />

        <form className="banner-form form-style-1" onSubmit={event=>{event.preventDefault();const search={checkIn,checkOut,guests};if(!validSearch(search)){setError("Chọn ngày nhận phòng từ hôm nay, ngày trả sau ngày nhận và ít nhất 1 khách.");return;}sessionStorage.setItem(flowKeys.search,JSON.stringify(search));sessionStorage.removeItem(flowKeys.draft);router.push(routes.reservation.selectRoom);}}>
          <div className="form-content">
            <div className="table-item"><label>Nhận phòng</label><input type="date" min={today()} value={checkIn} onChange={e=>setCheckIn(e.target.value)} required /></div>
            <div className="table-item"><label>Trả phòng</label><input type="date" min={checkIn||today()} value={checkOut} onChange={e=>setCheckOut(e.target.value)} required /></div>
            <div className="table-item"><label>Số khách</label><input type="number" min="1" value={guests} onChange={e=>setGuests(Number(e.target.value))} required /></div>
            <div className="table-item">
              <div className="form-btn mar-top-35">
                <button type="submit" className="btn btn-orange">Kiểm tra phòng trống</button>
              </div>
            </div>
          </div>
          {error&&<p role="alert" className="text-danger">{error}</p>}
        </form>
      </div>
    </section>
  );
}
