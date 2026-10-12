import type { Booking } from "@/features/bookings/bookings.types";
import type { Room } from "@/features/rooms/rooms.types";
export type Search = { checkIn: string; checkOut: string; guests: number; roomId?: number; locationId?: number };
export type Draft = Search & { room: Room };
export const flowKeys = { search: "reservation.search.v1", draft: "reservation.draft.v1", confirmation: "reservation.confirmation.v1" };
export function today() { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`; }
export function validDate(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const time = Date.parse(`${value}T00:00:00Z`);
  return Number.isFinite(time) && new Date(time).toISOString().slice(0, 10) === value;
}
export function validSearch(s: Search) { return validDate(s.checkIn) && validDate(s.checkOut) && s.checkIn >= today() && s.checkOut > s.checkIn && Number.isSafeInteger(s.guests) && s.guests > 0 && (s.roomId === undefined || (Number.isSafeInteger(s.roomId) && s.roomId > 0)) && (s.locationId === undefined || (Number.isSafeInteger(s.locationId) && s.locationId > 0)); }
export function nights(s: Pick<Search, "checkIn" | "checkOut">) { return Math.round((Date.parse(`${s.checkOut}T00:00:00Z`) - Date.parse(`${s.checkIn}T00:00:00Z`)) / 86400000); }
export function checkoutAfter(checkIn: string, count: number) {
  if (!validDate(checkIn) || !Number.isInteger(count) || count < 1) return "";
  const date = new Date(Date.parse(`${checkIn}T00:00:00Z`) + count * 86400000);
  if (!Number.isFinite(date.getTime())) return "";
  const result = date.toISOString().slice(0, 10);
  return validDate(result) ? result : "";
}
export type SearchParams = Record<string, string | string[] | undefined>;
export function searchFromParams(params: SearchParams): Search | null {
  if (typeof params.checkIn !== "string" || typeof params.checkOut !== "string" || typeof params.guests !== "string") return null;
  if (!/^[1-9]\d*$/.test(params.guests)) return null;
  const search: Search = { checkIn: params.checkIn, checkOut: params.checkOut, guests: Number(params.guests) };
  for (const [param, key] of [["maViTri", "locationId"], ["maPhong", "roomId"]] as const) {
    const value = params[param];
    if (value !== undefined) {
      if (typeof value !== "string" || !/^[1-9]\d*$/.test(value)) return null;
      search[key] = Number(value);
    }
  }
  return validSearch(search) ? search : null;
}
export function withStaySearch(href: string, search?: Search | null) {
  if (!search) return href;
  const [path, query] = href.split("?");
  const params = new URLSearchParams(query);
  params.set("checkIn", search.checkIn);
  params.set("checkOut", search.checkOut);
  params.set("guests", String(search.guests));
  if (search.locationId && !params.has("maViTri")) params.set("maViTri", String(search.locationId));
  return `${path}?${params}`;
}
export function overlaps(s: Search, b: Booking) { return s.checkIn < b.ngayDi.slice(0,10) && s.checkOut > b.ngayDen.slice(0,10); }
export function available(room: Room, s: Search, bookings: Booking[]) { return (s.locationId === undefined || room.maViTri === s.locationId) && (s.roomId === undefined || room.id === s.roomId) && room.khach >= s.guests && !bookings.some(b => b.maPhong === room.id && overlaps(s,b)); }
export function readSession<T>(key: string): T | null { try { const raw = sessionStorage.getItem(key); return raw ? JSON.parse(raw) as T : null; } catch { return null; } }
