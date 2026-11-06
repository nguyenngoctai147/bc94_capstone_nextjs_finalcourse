"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { routes } from "@/route";
import { createBooking } from "@/store/thunk/bookings";
import { bookingsService } from "@/features/bookings/bookings.service";
import { toApiError } from "@/services/api-utils";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { available, flowKeys, nights, readSession, type Draft, validSearch } from "../flow";
import { ReservationProgress, ReservationRoomHero, ReservationSummary, RoomAmenityList } from "./ReservationUi";
import styles from "@/theme/features/reservations/reservation.module.css";

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

  return <section className={`content ${styles.bookingPage}`}><div className="container">
    <ReservationProgress active={3} />
    <div className={`booking ${styles.bookingLayout}`}><div className="row">
      <div className="col-lg-8"><div className={`booking-content ${styles.bookingContent}`}>
        <ReservationRoomHero room={draft.room} />
        <RoomAmenityList room={draft.room} />
        <section className={`personal-info mar-top-50 ${styles.bookingSection}`}>
          <div className={`form-title ${styles.bookingSectionTitle}`}><span>1</span><div><p>Thông tin xác thực</p><h3>Thông tin người đặt</h3></div></div>
          {user ? <div className={`row ${styles.bookingFields}`}>
            <div className="col-md-6"><div className="form-group"><label htmlFor="booking-name"><i className="fa fa-user" aria-hidden="true" /> Họ tên</label><input id="booking-name" className="form-control" value={user.name} readOnly /></div></div>
            <div className="col-md-6"><div className="form-group"><label htmlFor="booking-email"><i className="fa fa-envelope-o" aria-hidden="true" /> Email</label><input id="booking-email" className="form-control" value={user.email} readOnly /></div></div>
            <div className="col-md-6"><div className="form-group"><label htmlFor="booking-phone"><i className="fa fa-phone" aria-hidden="true" /> Điện thoại</label><input id="booking-phone" className="form-control" value={user.phone ?? "Chưa cập nhật"} readOnly /></div></div>
            <div className="col-md-6"><div className="form-group"><label htmlFor="booking-birthday"><i className="fa fa-calendar-o" aria-hidden="true" /> Ngày sinh</label><input id="booking-birthday" className="form-control" value={user.birthday || "Chưa cập nhật"} readOnly /></div></div>
          </div> : <div className={`alert alert-warning ${styles.loginNotice}`}>Bạn cần <Link href={routes.auth.login}>đăng nhập</Link> để gửi yêu cầu đặt phòng.</div>}
          <p className={styles.bookingSectionHint}><i className="fa fa-shield" aria-hidden="true" /> Thông tin tài khoản chỉ dùng để đối chiếu đặt phòng. Bạn có thể cập nhật tại trang tài khoản.</p>
        </section>
        <section className={`card-info mar-top-50 ${styles.bookingSection}`}>
          <div className={`form-title ${styles.bookingSectionTitle}`}><span>2</span><div><p>Thanh toán an toàn</p><h3>Hình thức thanh toán</h3></div></div>
          <div className={`payment-desc ${styles.paymentPanel}`}><i className="fa fa-building-o" aria-hidden="true" /><div><p>Thanh toán trực tiếp tại nơi lưu trú</p><p>Hotux chưa thu thập thông tin thẻ và chưa xử lý thanh toán trực tuyến.</p></div></div>
          <div className={`form-group mar-bottom-30 ${styles.bookingAgreement}`}><input id="booking-agreement" type="checkbox" checked={agree} onChange={(event) => { setAgree(event.target.checked); setError(""); }} /> <label htmlFor="booking-agreement">Tôi xác nhận ngày ở, phòng, số khách và tổng tạm tính.</label></div>
          {error && <div className="alert alert-danger" role="alert">{error}</div>}
          <div className={`card-btn ${styles.bookingSubmit}`}><button className="btn btn-orange" type="button" disabled={busy || !user} onClick={() => void handleSubmit()}><i className="fa fa-check" aria-hidden="true" /> {busy ? "Đang gửi..." : "Xác nhận đặt phòng"}</button></div>
        </section>
      </div></div>
      <aside className={`col-lg-4 ${styles.bookingAside}`}><ReservationSummary stay={draft} price={draft.room.giaTien} /></aside>
    </div></div>
  </div></section>;
}
