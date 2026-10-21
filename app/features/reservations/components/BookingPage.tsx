"use client";
/* eslint-disable react-hooks/set-state-in-effect -- Reservation draft is browser-owned state restored after hydration. */

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { routes } from "@/config/routes";
import { createBooking } from "@/features/bookings/bookings.slice";
import { bookingsService } from "@/features/bookings/bookings.service";
import { toApiError } from "@/lib/api/errors";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { available, flowKeys, nights, readSession, type Draft, validSearch } from "../flow";
import { ReservationProgress, ReservationRoomHero, ReservationSummary, RoomAmenityList } from "./ReservationUi";
import styles from "./Reservation.module.css";

export function BookingPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user, token } = useAppSelector((state) => state.auth);
  const [draft, setDraft] = useState<Draft | null>(null);
  const [agree, setAgree] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const saved = readSession<Draft>(flowKeys.draft);
    if (!saved || !validSearch(saved) || !saved.room || saved.room.id !== saved.roomId && saved.roomId !== undefined || saved.guests > saved.room.khach) {
      router.replace(routes.reservation.availability);
      return;
    }
    setDraft(saved);
  }, [router]);

  if (!draft) return null;
  const total = nights(draft) * draft.room.giaTien;

  const handleSubmit = async () => {
    if (busy) return;
    if (!user || !token) { setError("Vui lòng đăng nhập để xác nhận đặt phòng."); return; }
    if (!agree) { setError("Vui lòng xác nhận thông tin đặt phòng."); return; }
    setBusy(true);
    setError("");
    try {
      const latest = await bookingsService.list({ token });
      if (!available(draft.room, draft, latest.data)) throw new Error("Phòng vừa được đặt trong khoảng ngày này. Vui lòng chọn phòng khác.");
      const booking = await dispatch(createBooking({
        maPhong: draft.room.id,
        maNguoiDung: user.id,
        ngayDen: `${draft.checkIn}T00:00:00`,
        ngayDi: `${draft.checkOut}T00:00:00`,
        soLuongKhach: draft.guests,
      })).unwrap();
      if (!booking?.id) throw new Error("Máy chủ chưa trả mã đặt phòng. Vui lòng kiểm tra danh sách trước khi thử lại.");
      sessionStorage.setItem(flowKeys.confirmation, JSON.stringify({ booking, room: draft.room, total, userId: user.id }));
      sessionStorage.removeItem(flowKeys.draft);
      router.push(routes.reservation.confirmation);
    } catch (cause) {
      setError(toApiError(cause).message);
    } finally {
      setBusy(false);
    }
  };

  return <section className="content"><div className="container">
    <ReservationProgress active={3} />
    <div className="booking"><div className="row">
      <div className="col-lg-8"><div className="booking-content">
        <ReservationRoomHero room={draft.room} />
        <RoomAmenityList room={draft.room} />
        <div className="personal-info mar-top-50">
          <div className="form-title"><span>1</span><h3>Thông tin người đặt</h3></div>
          {user ? <div className="row">
            <div className="col-md-6"><div className="form-group"><label>Họ tên</label><input className="form-control" value={user.name} readOnly /></div></div>
            <div className="col-md-6"><div className="form-group"><label>Email</label><input className="form-control" value={user.email} readOnly /></div></div>
            <div className="col-md-6"><div className="form-group"><label>Điện thoại</label><input className="form-control" value={user.phone ?? "Chưa cập nhật"} readOnly /></div></div>
            <div className="col-md-6"><div className="form-group"><label>Ngày sinh</label><input className="form-control" value={user.birthday || "Chưa cập nhật"} readOnly /></div></div>
          </div> : <div className={`alert alert-warning ${styles.loginNotice}`}>Bạn cần <Link href={routes.auth.login}>đăng nhập</Link> để gửi yêu cầu đặt phòng.</div>}
          <p className="text-muted">Thông tin tài khoản được dùng để đối chiếu đặt phòng. Bạn có thể cập nhật tại trang tài khoản.</p>
        </div>
        <div className="card-info mar-top-50">
          <div className="form-title"><span>2</span><h3>Hình thức thanh toán</h3></div>
          <div className="payment-desc"><p><i className="fa fa-building-o me-2" aria-hidden="true" /> Thanh toán trực tiếp tại nơi lưu trú.</p><p className="text-muted">Hotux chưa thu thập thông tin thẻ và chưa xử lý thanh toán trực tuyến.</p></div>
          <div className="form-group mar-bottom-30"><input id="booking-agreement" type="checkbox" checked={agree} onChange={(event) => { setAgree(event.target.checked); setError(""); }} /> <label htmlFor="booking-agreement">Tôi xác nhận ngày, phòng, số khách và tổng tạm tính ở bên cạnh.</label></div>
          {error && <div className="alert alert-danger" role="alert">{error}</div>}
          <div className="card-btn"><button className="btn btn-orange" type="button" disabled={busy || !user} onClick={() => void handleSubmit()}>{busy ? "Đang gửi..." : "Xác nhận đặt phòng"}</button></div>
        </div>
      </div></div>
      <aside className="col-lg-4"><ReservationSummary stay={draft} price={draft.room.giaTien} /></aside>
    </div></div>
  </div></section>;
}
