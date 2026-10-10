import type { Booking } from "@/features/bookings/bookings.types";
import type { Room } from "@/features/rooms/rooms.types";
export type Search = { checkIn: string; checkOut: string; guests: number };
export type Draft = Search & { room: Room };
export const flowKeys = { search: "reservation.search.v1", draft: "reservation.draft.v1", confirmation: "reservation.confirmation.v1" };
export function today() { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`; }
export function validSearch(s: Search) { return /^\d{4}-\d{2}-\d{2}$/.test(s.checkIn) && /^\d{4}-\d{2}-\d{2}$/.test(s.checkOut) && !Number.isNaN(Date.parse(s.checkIn)) && !Number.isNaN(Date.parse(s.checkOut)) && s.checkIn >= today() && s.checkOut > s.checkIn && Number.isInteger(s.guests) && s.guests > 0; }
export function nights(s: Search) { return Math.round((Date.parse(`${s.checkOut}T00:00:00Z`) - Date.parse(`${s.checkIn}T00:00:00Z`)) / 86400000); }
export function overlaps(s: Search, b: Booking) { return s.checkIn < b.ngayDi.slice(0,10) && s.checkOut > b.ngayDen.slice(0,10); }
export function available(room: Room, s: Search, bookings: Booking[]) { return room.khach >= s.guests && !bookings.some(b => b.maPhong === room.id && overlaps(s,b)); }
export function readSession<T>(key: string): T | null { try { const raw = sessionStorage.getItem(key); return raw ? JSON.parse(raw) as T : null; } catch { return null; } }
