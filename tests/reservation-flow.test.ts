import { test } from "node:test";
import assert from "node:assert/strict";
import { available, checkoutAfter, nights, overlaps, searchFromParams, validDate, withStaySearch } from "../app/features/reservations/flow";
import type { Booking } from "../app/features/bookings/bookings.types";
import type { Room } from "../app/features/rooms/rooms.types";
const room={id:7,khach:3} as Room;
const existing={id:1,maPhong:7,ngayDen:"2027-01-10T00:00:00",ngayDi:"2027-01-12T00:00:00",soLuongKhach:2,maNguoiDung:1} satisfies Booking;
test("adjacent stays do not overlap; crossing dates do",()=>{assert.equal(overlaps({checkIn:"2027-01-08",checkOut:"2027-01-10",guests:2},existing),false);assert.equal(overlaps({checkIn:"2027-01-12",checkOut:"2027-01-14",guests:2},existing),false);assert.equal(overlaps({checkIn:"2027-01-11",checkOut:"2027-01-13",guests:2},existing),true);});
test("capacity and existing bookings filter rooms",()=>{assert.equal(available(room,{checkIn:"2027-01-11",checkOut:"2027-01-13",guests:2},[existing]),false);assert.equal(available(room,{checkIn:"2027-01-12",checkOut:"2027-01-13",guests:4},[existing]),false);assert.equal(available(room,{checkIn:"2027-01-12",checkOut:"2027-01-13",guests:3},[existing]),true);});
test("night count uses calendar days",()=>{assert.equal(nights({checkIn:"2027-03-27",checkOut:"2027-03-30"}),3);});
test("search dates and number of nights stay consistent across months and leap years", () => {
  assert.equal(checkoutAfter("2028-02-28", 2), "2028-03-01");
  assert.equal(checkoutAfter("2099-12-31", 2), "2100-01-02");
  assert.equal(checkoutAfter("2027-02-30", 2), "");
  assert.equal(checkoutAfter("2099-01-01", 0), "");
  assert.equal(validDate("2027-02-29"), false);
  assert.equal(nights({ checkIn: "2028-02-28", checkOut: checkoutAfter("2028-02-28", 2) }), 2);
});
test("search URL keeps location, dates and guests through the selected room", () => {
  const search = searchFromParams({ maViTri: "1", checkIn: "2099-01-01", checkOut: "2099-01-04", guests: "3" });
  assert.ok(search);
  const target = withStaySearch("/reservation/availability?maPhong=7", search);
  const parsed = searchFromParams(Object.fromEntries(new URLSearchParams(target.split("?")[1])));
  assert.deepEqual(parsed, { ...search, roomId: 7 });
  assert.equal(available({ ...room, maViTri: 2 }, search, []), false);
  assert.equal(available({ ...room, maViTri: 1 }, search, []), true);
  assert.equal(available({ ...room, id: 8, maViTri: 1 }, parsed!, []), false);
});
test("incomplete, impossible and reversed URL dates cannot start a room search", () => {
  const base = { maViTri: "1", checkIn: "2099-01-01", checkOut: "2099-01-04", guests: "2" };
  assert.equal(searchFromParams({ ...base, checkIn: "2099-02-30" }), null);
  assert.equal(searchFromParams({ ...base, checkOut: base.checkIn }), null);
  assert.equal(searchFromParams({ ...base, checkOut: undefined }), null);
  assert.equal(searchFromParams({ ...base, guests: "0" }), null);
  assert.equal(searchFromParams({ ...base, maViTri: ["1", "2"] }), null);
});
