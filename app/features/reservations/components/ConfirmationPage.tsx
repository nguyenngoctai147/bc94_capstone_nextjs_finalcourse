"use client";
/* eslint-disable react-hooks/set-state-in-effect -- Hydrate confirmation from sessionStorage on mount. */
import { useEffect, useState } from "react";
import Link from "next/link";
import { routes } from "@/config/routes";
import { useAppSelector } from "@/store/hooks";
import type { Booking } from "@/features/bookings/bookings.types";
import type { Room } from "@/features/rooms/rooms.types";
import { flowKeys, readSession } from "../flow";
import { ReservationProgress } from "./AvailabilityPage";
type Confirmation={booking:Booking;room:Room;total:number;userId:number};
export function ConfirmationPage(){const userId=useAppSelector(s=>s.auth.user?.id);const [data,setData]=useState<Confirmation|null>(null);useEffect(()=>{const value=readSession<Confirmation>(flowKeys.confirmation);if(value?.booking?.id&&value.userId===userId)setData(value);},[userId]);return <section className="content"><div className="container"><ReservationProgress active={4}/>{data?<><div className="success-notify"><div className="success-icon"><i className="fa fa-check"/></div><div className="success-content"><h4 className="white">Đã ghi nhận đặt phòng #{data.booking.id}</h4><p className="white">Thông tin đã được lưu trên hệ thống để quản trị viên xem. Thanh toán tại nơi lưu trú.</p></div></div><div className="confirmation booking-content mar-top-60"><h3>{data.room.tenPhong}</h3><table className="table"><tbody><tr><td>Mã đặt phòng</td><td>{data.booking.id}</td></tr><tr><td>Nhận phòng</td><td>{data.booking.ngayDen.slice(0,10)}</td></tr><tr><td>Trả phòng</td><td>{data.booking.ngayDi.slice(0,10)}</td></tr><tr><td>Số khách</td><td>{data.booking.soLuongKhach}</td></tr><tr><td>Giá tham khảo</td><td>{data.total.toLocaleString("vi-VN")}</td></tr><tr><td>Thanh toán</td><td>Chưa thanh toán · thanh toán tại nơi lưu trú</td></tr></tbody></table><Link href={routes.bookings}>Xem đặt phòng của tôi</Link></div></>:<div className="mar-top-60"><h3>Chưa có thông tin xác nhận</h3><p>Vui lòng kiểm tra danh sách đặt phòng của bạn.</p><Link href={routes.bookings}>Đặt phòng của tôi</Link></div>}</div></section>}
