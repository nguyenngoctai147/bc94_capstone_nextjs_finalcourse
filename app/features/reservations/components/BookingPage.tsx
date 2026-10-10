"use client";
/* eslint-disable react-hooks/set-state-in-effect -- Hydrate reservation state from sessionStorage on mount. */
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { routes } from "@/config/routes";
import { useAppSelector } from "@/store/hooks";
import { bookingsService } from "@/features/bookings/bookings.service";
import { available, flowKeys, nights, readSession, type Draft, validSearch } from "../flow";
import { ReservationProgress } from "./AvailabilityPage";
export function BookingPage(){
 const router=useRouter(); const user=useAppSelector(s=>s.auth.user); const token=useAppSelector(s=>s.auth.token); const [draft,setDraft]=useState<Draft|null>(null);const [agree,setAgree]=useState(false);const [busy,setBusy]=useState(false);const [error,setError]=useState("");
 useEffect(()=>{const d=readSession<Draft>(flowKeys.draft);if(!d||!validSearch(d)||!d.room||d.guests>d.room.khach){router.replace(routes.reservation.availability);return;}setDraft(d);},[router]);
 if(!draft)return null;
 const total=nights(draft)*draft.room.giaTien;
 async function submit(){if(!draft)return;if(!user||!token){setError("Vui lòng đăng nhập để xác nhận đặt phòng.");return;}if(!agree){setError("Vui lòng xác nhận thông tin đặt phòng.");return;}setBusy(true);setError("");try{const latest=await bookingsService.list({token});if(!available(draft.room,draft,latest.data))throw new Error("Phòng vừa được đặt trong khoảng ngày này. Vui lòng chọn phòng khác.");const booking=await bookingsService.create({maPhong:draft.room.id,maNguoiDung:user.id,ngayDen:`${draft.checkIn}T00:00:00`,ngayDi:`${draft.checkOut}T00:00:00`,soLuongKhach:draft.guests},{token});if(!booking?.id)throw new Error("Máy chủ chưa trả mã đặt phòng. Vui lòng kiểm tra Đặt phòng của tôi trước khi thử lại.");sessionStorage.setItem(flowKeys.confirmation,JSON.stringify({booking,room:draft.room,total,userId:user.id}));sessionStorage.removeItem(flowKeys.draft);router.push(routes.reservation.confirmation);}catch(e){setError(e instanceof Error?e.message:"Đặt phòng thất bại. Vui lòng thử lại.");}finally{setBusy(false);}}
 return <section className="content"><div className="container"><ReservationProgress active={3}/><div className="row"><div className="col-lg-8"><h3>Xác nhận đặt phòng</h3><h4>{draft.room.tenPhong}</h4><p>Nhận phòng: {draft.checkIn} · Trả phòng: {draft.checkOut}</p><p>{draft.guests} khách · {nights(draft)} đêm</p><p>Khách đặt: {user?.name||"Chưa đăng nhập"} · {user?.email||""}</p><h4>Thanh toán</h4><p>Thanh toán tại nơi lưu trú. Trang này chưa hỗ trợ thanh toán trực tuyến.</p><label><input type="checkbox" checked={agree} onChange={e=>setAgree(e.target.checked)}/> Tôi xác nhận ngày, phòng và số khách đã chọn.</label><div className="mar-top-20">{!user&&<p><Link href={routes.auth.login}>Đăng nhập để đặt phòng</Link></p>}{error&&<p role="alert" className="text-danger">{error}</p>}<button className="btn btn-orange" type="button" disabled={busy||!user} onClick={submit}>{busy?"Đang gửi...":"Xác nhận đặt phòng"}</button></div></div><div className="col-lg-4"><div className="sidebar-reservation"><h3>Chi tiết chi phí</h3><p>{draft.room.giaTien.toLocaleString("vi-VN")} × {nights(draft)} đêm</p><h4>Tổng: {total.toLocaleString("vi-VN")}</h4><p>Giá tham khảo theo dữ liệu phòng; chưa gồm phụ phí tại nơi lưu trú.</p></div></div></div></div></section>;
}
