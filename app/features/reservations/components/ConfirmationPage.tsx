"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { routes } from "@/config/routes";
import type { Booking } from "@/features/bookings/bookings.types";
import type { Room } from "@/features/rooms/rooms.types";
import { useAppSelector } from "@/store/hooks";
import { flowKeys, readSession } from "../flow";
import { ReservationProgress, ReservationRoomHero, ReservationSummary, RoomAmenityList } from "./ReservationUi";

type Confirmation = { booking: Booking; room: Room; total: number; userId: number };

function isConfirmation(value: Confirmation | null): value is Confirmation {
  return Boolean(value && Number.isSafeInteger(value.userId) && value.userId > 0
    && Number.isSafeInteger(value.booking?.id) && value.booking.id > 0
    && Number.isSafeInteger(value.room?.id) && value.room.id > 0
    && Number.isFinite(value.total) && value.total >= 0);
}

export function ConfirmationPage() {
  const user = useAppSelector((state) => state.auth.user);
  const [saved, setSaved] = useState<Confirmation | null>(null);
  useEffect(() => {
    const value = readSession<Confirmation>(flowKeys.confirmation);
    setSaved(isConfirmation(value) ? value : null);
  }, []);
  const data = saved?.userId === user?.id ? saved : null;

  return <section className="content"><div className="container">
    <ReservationProgress active={4} />
    {data ? <>
      <div className="success-notify"><div className="success-icon"><i className="fa fa-check" /></div><div className="success-content"><h2 className="h4 white mar-bottom-5">Đã ghi nhận đặt phòng #{data.booking.id}</h2><p className="white mar-0">Thông tin đã được lưu trên hệ thống. Bạn sẽ thanh toán trực tiếp tại nơi lưu trú.</p></div></div>
      <div className="confirmation booking-content mar-top-60"><div className="row">
        <div className="col-lg-8"><div className="confirmation-content">
          <ReservationRoomHero room={data.room} />
          <div className="other-details detail-table mar-top-50"><h3 className="h4 mar-bottom-30">Chi tiết đặt phòng</h3><table className="table"><tbody>
            <tr><th scope="row">Mã đặt phòng</th><td>#{data.booking.id}</td></tr>
            <tr><th scope="row">Khách đặt</th><td>{user?.name}</td></tr>
            <tr><th scope="row">Email</th><td>{user?.email}</td></tr>
            <tr><th scope="row">Điện thoại</th><td>{user?.phone || "Chưa cập nhật"}</td></tr>
            <tr><th scope="row">Nhận phòng</th><td>{data.booking.ngayDen.slice(0, 10)}</td></tr>
            <tr><th scope="row">Trả phòng</th><td>{data.booking.ngayDi.slice(0, 10)}</td></tr>
            <tr><th scope="row">Số khách</th><td>{data.booking.soLuongKhach}</td></tr>
          </tbody></table></div>
          <RoomAmenityList room={data.room} />
          <div className="payment mar-top-50"><h3 className="h4 mar-bottom-30">Thanh toán</h3><div className="payment-desc"><p>Chưa thanh toán · thanh toán trực tiếp tại nơi lưu trú.</p></div></div>
          <div className="payment mar-top-50"><h3 className="h4 mar-bottom-30">Quản lý đặt phòng</h3><div className="payment-desc"><p><Link href={routes.bookings}>Xem tất cả đặt phòng của tôi <i className="fa fa-angle-right" /></Link></p></div></div>
        </div></div>
        <aside className="col-lg-4"><ReservationSummary stay={{ checkIn: data.booking.ngayDen.slice(0, 10), checkOut: data.booking.ngayDi.slice(0, 10), guests: data.booking.soLuongKhach }} price={data.room.giaTien} /></aside>
      </div></div>
    </> : <div className="mar-top-60 text-center"><h2>Chưa có thông tin xác nhận</h2><p>Phiên xác nhận có thể đã hết hạn hoặc không thuộc tài khoản đang đăng nhập.</p><Link href={routes.bookings} className="btn btn-orange">Đặt phòng của tôi</Link></div>}
  </div></section>;
}
