import assert from "node:assert/strict";
import test from "node:test";
import { filterRooms, initialRoomFilters, selectRelatedRooms } from "../app/features/rooms/room-list.utils";
import type { Room } from "../app/features/rooms/rooms.types";
import type { Booking } from "../app/features/bookings/bookings.types";

const makeRoom = (values: Partial<Room>): Room => ({
  id: 1, tenPhong: "Phòng thử nghiệm", khach: 4, phongNgu: 2, giuong: 2, phongTam: 1,
  moTa: "", giaTien: 50, maViTri: 1, hinhAnh: "", wifi: true, hoBoi: true,
  mayGiat: false, banLa: false, banUi: false, tivi: false, dieuHoa: false, bep: false, doXe: false,
  ...values,
});

test("room filters combine bedrooms, price and all selected amenities", () => {
  const rooms = [
    makeRoom({ id: 1 }),
    makeRoom({ id: 2, giaTien: 20, hoBoi: false }),
    makeRoom({ id: 3, giaTien: 80, phongNgu: 3 }),
  ];
  const result = filterRooms(rooms, {
    filters: { bedrooms: "2", maxPrice: 60, amenities: ["wifi", "hoBoi"], minRating: null },
    sortOrder: "recommended", bookings: [],
  });
  assert.deepEqual(result.map((room) => room.id), [1]);
  assert.deepEqual(initialRoomFilters.amenities, []);
});

test("sorting a frozen catalogue returns a new list without changing Redux data", () => {
  const rooms = Object.freeze([makeRoom({ id: 1 }), makeRoom({ id: 2, giaTien: 20 }), makeRoom({ id: 3, giaTien: 80 })]);
  const options = { filters: initialRoomFilters, bookings: [] };
  assert.deepEqual(filterRooms(rooms, { ...options, sortOrder: "price-low" }).map((room) => room.id), [2, 1, 3]);
  assert.deepEqual(filterRooms(rooms, { ...options, sortOrder: "price-high" }).map((room) => room.id), [3, 1, 2]);
  assert.deepEqual(rooms.map((room) => room.id), [1, 2, 3]);
});

test("room search respects location, guest capacity and overlapping bookings together", () => {
  const rooms = [makeRoom({ id: 1 }), makeRoom({ id: 2 }), makeRoom({ id: 3, maViTri: 2 }), makeRoom({ id: 4, khach: 1 })];
  const bookings: Booking[] = [{ id: 99, maPhong: 2, maNguoiDung: 7, ngayDen: "2030-10-21", ngayDi: "2030-10-25", soLuongKhach: 2 }];
  const result = filterRooms(rooms, {
    filters: initialRoomFilters, sortOrder: "recommended", locationId: 1,
    search: { checkIn: "2030-10-20", checkOut: "2030-10-23", guests: 2 }, bookings,
  });
  assert.deepEqual(result.map((room) => room.id), [1]);
});

test("related rooms prefer the same location and fill empty slots without duplicates", () => {
  const currentRoom = makeRoom({ id: 1, maViTri: 10 });
  const nearbyRooms = [currentRoom, makeRoom({ id: 2, maViTri: 10 })];
  const fallbackRooms = [
    makeRoom({ id: 2, maViTri: 10 }),
    makeRoom({ id: 3, maViTri: 20 }),
    makeRoom({ id: 4, maViTri: 30 }),
  ];

  const related = selectRelatedRooms(currentRoom, nearbyRooms, fallbackRooms);

  assert.deepEqual(related.map((room) => room.id), [2, 3, 4]);
});

test("room filters apply a selected minimum rating when rating data is available", () => {
  const rooms = [makeRoom({ id: 1 }), makeRoom({ id: 2 })];
  const result = filterRooms(rooms, {
    filters: { ...initialRoomFilters, minRating: 4 },
    sortOrder: "recommended",
    bookings: [],
    ratingsByRoom: new Map([[1, 4.5], [2, 3.9]]),
  });

  assert.deepEqual(result.map((room) => room.id), [1]);
});
