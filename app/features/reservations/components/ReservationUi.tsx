"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ApiImage } from "@/components/ui/ApiImage";
import { routes } from "@/config/routes";
import { roomAmenities } from "@/features/rooms/room-amenities";
import { RoomAmenityIcon } from "@/features/rooms/components/RoomAmenityIcon";
import type { Room } from "@/features/rooms/rooms.types";
import { checkoutAfter, nights, today, type Search } from "../flow";
import styles from "@/css/features/reservations/reservation.module.css";

export function ReservationProgress({ active }: { active: 1 | 2 | 3 | 4 }) {
  const steps = [
    ["Kiểm tra phòng trống", routes.reservation.availability],
    ["Chọn phòng", routes.reservation.selectRoom],
    ["Đặt phòng", routes.reservation.booking],
    ["Xác nhận", routes.reservation.confirmation],
  ] as const;
  return <div className="reservation-links text-center">
    <h2 className="mar-bottom-60 text-capitalize">Đặt chỗ nghỉ của bạn</h2>
    <div className="reservation-links-content">{steps.map(([label, href], index) => {
      const step = (index + 1) as 1 | 2 | 3 | 4;
      return <div className="res-item" key={label}><Link href={href} className={step <= active ? "active" : undefined} aria-current={step === active ? "step" : undefined}>{step < active ? <i className="fa fa-check" aria-hidden="true" /> : step}</Link><p>{label}</p></div>;
    })}</div>
  </div>;
}

export function RoomAmenityList({ room, title = "Tiện nghi đi kèm" }: { room: Room; title?: string }) {
  const amenities = roomAmenities.filter(({ key }) => room[key] === true);
  if (amenities.length === 0) return null;
  return <div className="extra-services mar-top-40"><h3 className="h4 mar-bottom-30">{title}</h3><ul>{amenities.map(({ key, label }) => <li key={key}><RoomAmenityIcon amenity={key} /> {label}</li>)}</ul></div>;
}

export function ReservationRoomHero({ room }: { room: Room }) {
  return <div className="booking-image">
    <ApiImage src={room.hinhAnh} alt={`Phòng ${room.tenPhong}`} width={1200} height={720} sizes="(max-width: 991px) 100vw, 66vw" className={styles.heroImage} fallback={<div className={styles.imageFallback}>Chưa có ảnh phòng</div>} />
    <div className="booking-title"><div className="title-left"><h2 className="h3">{room.tenPhong}</h2><p className="mar-0">{room.khach} khách · {room.phongNgu} phòng ngủ · {room.giuong} giường · {room.phongTam} phòng tắm</p></div><div className="title-right pull-right"><div className="title-price"><h3><span>${room.giaTien.toLocaleString("vi-VN")}</span><small>/đêm</small></h3></div></div></div>
  </div>;
}

function formatDay(value: string) {
  const date = new Date(`${value}T00:00:00`);
  return Number.isNaN(date.getTime()) ? { day: "--", month: "Chưa chọn", weekday: "" } : {
    day: new Intl.DateTimeFormat("vi-VN", { day: "2-digit" }).format(date),
    month: new Intl.DateTimeFormat("vi-VN", { month: "long", year: "numeric" }).format(date),
    weekday: new Intl.DateTimeFormat("vi-VN", { weekday: "long" }).format(date),
  };
}

export function ReservationSummary({ stay, price }: { stay: Pick<Search, "checkIn" | "checkOut" | "guests">; price: number }) {
  const checkIn = formatDay(stay.checkIn);
  const checkOut = formatDay(stay.checkOut);
  const count = Math.max(0, nights(stay));
  const total = price * count;
  return <div className="detail-sidebar"><div className="sidebar-reservation">
    <h3>Thông tin đặt phòng</h3>
    <div className="reservation-detail">
      <div className="rd-top"><div className="rd-box"><label>Nhận phòng</label><p className="bold">{checkIn.day}</p><p>{checkIn.month}<br />{checkIn.weekday}</p></div><div className="rd-box"><label>Trả phòng</label><p className="bold">{checkOut.day}</p><p>{checkOut.month}<br />{checkOut.weekday}</p></div></div>
      <div className="rd-top"><div className="rd-box"><p className="bold">{String(stay.guests).padStart(2, "0")}</p><p>Khách</p></div><div className="rd-box"><p className="bold">{String(count).padStart(2, "0")}</p><p>Đêm</p></div></div>
    </div>
    <table className="reservation-table table"><tbody><tr><td>1 phòng × {count} đêm</td><td>${total.toLocaleString("vi-VN")}</td></tr><tr><td>Thanh toán</td><td>Tại nơi ở</td></tr></tbody><tfoot><tr><td>Tổng tạm tính</td><td>${total.toLocaleString("vi-VN")}</td></tr></tfoot></table>
  </div><div className="sidebar-support"><h3>Hỗ trợ đặt phòng</h3><p>Cần thay đổi ngày hoặc số khách? Quay lại bước đầu trước khi xác nhận.</p><p><i className="fa fa-phone" /> 1900 1234</p></div></div>;
}

type CalendarCell = { key: string; value?: string; day?: number };
const monthKey = (date: Date) => `${date.getFullYear()}-${date.getMonth()}`;
const dateValue = (date: Date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

function buildMonth(date: Date): CalendarCell[] {
  const year = date.getFullYear();
  const month = date.getMonth();
  const first = new Date(year, month, 1);
  const mondayOffset = (first.getDay() + 6) % 7;
  const days = new Date(year, month + 1, 0).getDate();
  return [
    ...Array.from({ length: mondayOffset }, (_, index) => ({ key: `${monthKey(date)}-empty-${index}` })),
    ...Array.from({ length: days }, (_, index) => {
      const day = index + 1;
      const value = dateValue(new Date(year, month, day));
      return { key: value, value, day };
    }),
  ];
}

function CalendarMonth({ month, value, onSelect }: { month: Date; value: Pick<Search, "checkIn" | "checkOut">; onSelect: (date: string) => void }) {
  const cells = useMemo(() => buildMonth(month), [month]);
  const label = new Intl.DateTimeFormat("vi-VN", { month: "long", year: "numeric" }).format(month);
  return <div className={styles.calendarMonth}><h3>{label}</h3><div className={styles.weekdays}>{["T2", "T3", "T4", "T5", "T6", "T7", "CN"].map((day) => <span key={day}>{day}</span>)}</div><div className={styles.days}>{cells.map((cell) => cell.value ? <button type="button" key={cell.key} disabled={cell.value < today()} className={`${cell.value === value.checkIn || cell.value === value.checkOut ? styles.selectedDay : ""} ${value.checkIn && value.checkOut && cell.value > value.checkIn && cell.value < value.checkOut ? styles.inRange : ""}`} onClick={() => onSelect(cell.value!)}>{cell.day}</button> : <span key={cell.key} />)}</div></div>;
}

export function DateRangeCalendar({ value, onChange }: { value: Pick<Search, "checkIn" | "checkOut">; onChange: (value: Pick<Search, "checkIn" | "checkOut">) => void }) {
  const initial = value.checkIn ? new Date(`${value.checkIn}T00:00:00`) : new Date();
  const [month, setMonth] = useState(() => new Date(initial.getFullYear(), initial.getMonth(), 1));
  const [selectingEnd, setSelectingEnd] = useState(false);
  const second = new Date(month.getFullYear(), month.getMonth() + 1, 1);
  const handleSelect = (date: string) => {
    if (!selectingEnd || !value.checkIn || date <= value.checkIn) {
      onChange({ checkIn: date, checkOut: checkoutAfter(date, 1) });
      setSelectingEnd(true);
      return;
    }
    onChange({ checkIn: value.checkIn, checkOut: date });
    setSelectingEnd(false);
  };
  return <div className={`calendar-range ${styles.calendar}`}><div className={styles.calendarControls}><button type="button" aria-label="Hai tháng trước" onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() - 2, 1))}><i className="fa fa-angle-left" /></button><p>Chọn ngày nhận và ngày trả phòng</p><button type="button" aria-label="Hai tháng sau" onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() + 2, 1))}><i className="fa fa-angle-right" /></button></div><div className={styles.calendarGrid}><CalendarMonth month={month} value={value} onSelect={handleSelect} /><CalendarMonth month={second} value={value} onSelect={handleSelect} /></div></div>;
}
