"use client";
/* eslint-disable react-hooks/set-state-in-effect -- Hydrate reservation state from sessionStorage on mount. */
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { routes } from "@/config/routes";
import { roomsService } from "@/features/rooms/rooms.service";
import { bookingsService } from "@/features/bookings/bookings.service";
import type { Room } from "@/features/rooms/rooms.types";
import type { Booking } from "@/features/bookings/bookings.types";
import { available, flowKeys, nights, readSession, type Search, validSearch } from "../flow";
import { ReservationProgress } from "./AvailabilityPage";
export function SelectRoomPage() {
 const router = useRouter(); const [search,setSearch]=useState<Search|null>(null); const [rooms,setRooms]=useState<Room[]>([]); const [bookings,setBookings]=useState<Booking[]>([]); const [error,setError]=useState(""); const [loading,setLoading]=useState(true);
 useEffect(()=>{ const s=readSession<Search>(flowKeys.search); if(!s||!validSearch(s)){router.replace(routes.reservation.availability);return;} setSearch(s); Promise.all([roomsService.list(),bookingsService.list()]).then(([r,b])=>{setRooms(r.data);setBookings(b.data);}).catch(()=>setError("Không thể kiểm tra phòng trống. Vui lòng thử lại.")).finally(()=>setLoading(false)); },[router]);
 if(!search)return null;
 const open=rooms.filter(room=>available(room,search,bookings));
 return <section className="content reservation-main"><div className="container"><ReservationProgress active={2}/><h3>Phòng trống: {search.checkIn} → {search.checkOut}</h3><p>{search.guests} khách · {nights(search)} đêm</p>{loading&&<p>Đang kiểm tra phòng...</p>}{error&&<p role="alert" className="text-danger">{error}</p>}{!loading&&!error&&<div className="row">{open.map(room=><div className="col-md-6 mar-bottom-30" key={room.id}><div className="card p-3"><h4>{room.tenPhong}</h4><p>{room.khach} khách · {room.phongNgu} phòng ngủ</p><p>{room.giaTien.toLocaleString("vi-VN")} / đêm</p><button className="btn btn-orange" onClick={()=>{sessionStorage.setItem(flowKeys.draft,JSON.stringify({...search,room}));router.push(routes.reservation.booking);}}>Chọn phòng</button></div></div>)}{open.length===0&&<p>Không có phòng phù hợp trong khoảng ngày này.</p>}</div>}</div></section>;
}
