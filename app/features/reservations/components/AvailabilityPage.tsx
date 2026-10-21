"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { flowKeys, nights, validSearch, type Search } from "../flow";
import { StayDateFields } from "./StayDateFields";
import { routes } from "@/config/routes";
import { DateRangeCalendar, ReservationProgress } from "./ReservationUi";

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
        {roomId && <p className="text-center mar-bottom-30">Kiểm tra ngày trống cho phòng đã chọn (mã #{roomId}).</p>}

        <form className="banner-form form-style-1" onSubmit={handleSubmit}>
          <div className="form-content">
            <StayDateFields idPrefix="reservation" value={stay} onChange={(value) => { setStay(value); setError(""); }} showNights={false} />
            <div className="table-item"><div className="form-group"><label htmlFor="reservation-guests">Số khách</label><input id="reservation-guests" className="form-control" type="number" min="1" value={guests} onChange={(event) => { setGuests(Number(event.target.value)); setError(""); }} required /></div></div>
            <div className="table-item"><div className="form-group"><label htmlFor="reservation-nights">Số đêm</label><input id="reservation-nights" className="form-control" value={Math.max(0, nights(stay)) || ""} placeholder="Số đêm" readOnly /></div></div>
            <div className="table-item">
              <div className="form-btn mar-top-35">
                <button type="submit" className="btn btn-orange">Kiểm tra phòng trống</button>
              </div>
            </div>
          </div>
          {error && <p role="alert" className="text-danger">{error}</p>}
        </form>
        <DateRangeCalendar value={stay} onChange={(value) => { setStay(value); setError(""); }} />
      </div>
    </section>
  );
}
