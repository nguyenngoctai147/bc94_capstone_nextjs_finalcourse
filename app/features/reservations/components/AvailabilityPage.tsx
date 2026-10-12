"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { flowKeys, validSearch, type Search } from "../flow";
import { StayDateFields } from "./StayDateFields";
import { routes } from "@/config/routes";

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

export function AvailabilityPage({ roomId, initialSearch }: { roomId?: number; initialSearch?: Search }) {
  const router = useRouter();
  const [stay, setStay] = useState({ checkIn: initialSearch?.checkIn ?? "", checkOut: initialSearch?.checkOut ?? "" });
  const [guests, setGuests] = useState(initialSearch?.guests ?? 1);
  const [error, setError] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const search = { ...stay, guests, ...(roomId ? { roomId } : {}), ...(initialSearch?.locationId ? { locationId: initialSearch.locationId } : {}) };
    if (!validSearch(search)) {
      setError("Chọn ngày nhận phòng từ hôm nay, ngày trả sau ngày nhận và ít nhất 1 khách.");
      return;
    }
    try {
      sessionStorage.setItem(flowKeys.search, JSON.stringify(search));
      sessionStorage.removeItem(flowKeys.draft);
    } catch {
      setError("Không thể lưu thông tin tìm kiếm. Vui lòng cho phép lưu trữ trên trình duyệt rồi thử lại.");
      return;
    }
    router.push(routes.reservation.selectRoom);
  }

  return (
    <section className="content reservation-main">
      <div className="container">
        <ReservationProgress active={1} />
        {roomId && <p className="text-center">Kiểm tra ngày trống cho phòng đã chọn (mã #{roomId}).</p>}

        <form className="banner-form form-style-1" onSubmit={handleSubmit}>
          <div className="form-content">
            <StayDateFields idPrefix="reservation" value={stay} onChange={(value) => { setStay(value); setError(""); }} />
            <div className="table-item"><label htmlFor="reservation-guests">Số khách</label><input id="reservation-guests" type="number" min="1" value={guests} onChange={e=>setGuests(Number(e.target.value))} required /></div>
            <div className="table-item">
              <div className="form-btn mar-top-35">
                <button type="submit" className="btn btn-orange">Kiểm tra phòng trống</button>
              </div>
            </div>
          </div>
          {error && <p role="alert" className="text-danger">{error}</p>}
        </form>
      </div>
    </section>
  );
}
