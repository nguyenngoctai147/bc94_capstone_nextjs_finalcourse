import assert from "node:assert/strict";
import { afterEach, test } from "node:test";
import type { AxiosAdapter, InternalAxiosRequestConfig } from "axios";
import { http, api } from "../app/services/api";
import { toPage, unwrapResponse } from "../app/lib/api/response";
import { usersService } from "../app/features/users/users.service";
import { roomsService } from "../app/features/rooms/rooms.service";
import { makeStore } from "../app/store";
import { fetchRooms, fetchRoomDetail, patchRoom, fetchRoomsByLocation } from "../app/features/rooms/rooms.slice";
import { fetchLocations } from "../app/features/locations/locations.slice";
import { login } from "../app/features/auth/auth.slice";
import { fetchBookings, createBooking, deleteBooking } from "../app/features/bookings/bookings.slice";
import { logout } from "../app/features/auth/auth.slice";
import type { Room } from "../app/features/rooms/rooms.types";
import type { Location } from "../app/features/locations/locations.types";
import type { Booking } from "../app/features/bookings/bookings.types";

const original = http.defaults.adapter;
afterEach(() => { http.defaults.adapter = original; });
const response = (config: InternalAxiosRequestConfig, content: unknown) => ({ data: { statusCode: 200, content }, status: 200, statusText: "OK", headers: {}, config });

test("explicit booking thunks invalidate cached lists and handle partial write responses", async () => {
  const store = makeStore();
  const booking: Booking = { id: 19, maPhong: 2, maNguoiDung: 7, ngayDen: "2030-10-20", ngayDi: "2030-10-23", soLuongKhach: 2 };
  store.dispatch(fetchBookings.pending("cached-bookings", undefined));
  store.dispatch(fetchBookings.fulfilled(toPage([booking]), "cached-bookings", undefined));

  const calls: InternalAxiosRequestConfig[] = [];
  http.defaults.adapter = async (config) => {
    calls.push(config);
    return response(config, config.method === "post" ? { id: 43 } : undefined);
  };

  await store.dispatch(createBooking({ maPhong: 3, maNguoiDung: 7, ngayDen: "2030-11-01", ngayDi: "2030-11-03", soLuongKhach: 2 })).unwrap();
  assert.equal(store.getState().bookings.requests.create.status, "succeeded");
  assert.equal(store.getState().bookings.invalidated, true);
  assert.deepEqual(store.getState().bookings.items, [booking]);

  await store.dispatch(deleteBooking(19)).unwrap();
  assert.equal(store.getState().bookings.requests.remove.status, "succeeded");
  assert.deepEqual(store.getState().bookings.items, []);
  assert.deepEqual(calls.map((request) => [request.method, request.url]), [["post", "/dat-phong"], ["delete", "/dat-phong/19"]]);
});
test("unwrap envelopes, plain data, paginated lists and application errors", () => {
  assert.equal(unwrapResponse({ statusCode: 200, content: 42 }), 42);
  assert.deepEqual(toPage([1, 2]).data, [1, 2]);
  assert.throws(() => unwrapResponse({ statusCode: 400, content: "Invalid" }));
  assert.throws(() => toPage(null as never));
  assert.equal(unwrapResponse(undefined), undefined);
});
test("REST methods, user deletion query, paginated search and multipart upload", async () => {
  const calls: InternalAxiosRequestConfig[] = [];
  http.defaults.adapter = (async (config) => { calls.push(config); return response(config, []); }) satisfies AxiosAdapter;
  await api.get("/phong-thue");
  await api.post("/phong-thue", { tenPhong: "Demo" });
  await api.put("/phong-thue/1", { tenPhong: "Updated" });
  await api.patch("/phong-thue/1", { wifi: true });
  await usersService.remove(12, { token: "user-token" });
  assert.deepEqual(calls.map((call) => call.method), ["get", "post", "put", "patch", "delete"]);
  assert.equal(calls[4].url, "/users"); assert.equal(calls[4].params.id, 12);
  assert.equal(calls[4].headers.get("token"), "user-token");
  await roomsService.list({ params: { pageIndex: 2, pageSize: 9, keyword: "sea" } });
  assert.equal(calls[5].url, "/phong-thue/phan-trang-tim-kiem");
  assert.equal(calls[5].params.keyword, "sea");
  await roomsService.uploadImage(5, new File(["image"], "room.png", { type: "image/png" }));
  assert.ok(calls[6].data instanceof FormData);
  assert.ok(calls[6].data.get("formFile") instanceof File);
  assert.equal(calls[6].params.maPhong, 5);
});
test("unsupported PATCH becomes a serializable thunk error", async () => {
  const store = makeStore();
  await store.dispatch(patchRoom({ id: 1, data: { wifi: true } }));
  assert.equal(store.getState().rooms.requests.patch.error?.status, 405);
});
test("stores are isolated; stale results and aborted requests cannot overwrite newer data", async () => {
  const first = makeStore(); const second = makeStore();
  const room = { id: 2, tenPhong: "Latest" } as Room;
  first.dispatch(fetchRooms.pending("old", undefined));
  first.dispatch(fetchRooms.pending("new", undefined));
  first.dispatch(fetchRooms.fulfilled(toPage([room]), "new", undefined));
  first.dispatch(fetchRooms.fulfilled(toPage([{ id: 1 } as Room]), "old", undefined));
  assert.equal(first.getState().rooms.items[0].id, 2);
  assert.equal(second.getState().rooms.items.length, 0);
  first.dispatch(fetchRoomDetail.pending("abort", 1));
  first.dispatch(fetchRoomDetail.rejected({ name: "AbortError", message: "Aborted" }, "abort", 1));
  assert.equal(first.getState().rooms.requests.detail.status, "idle");
});
test("real thunk dispatch transitions through pending, fulfillment and normalized failure", async () => {
  const store = makeStore();
  http.defaults.adapter = async (config) => response(config, [{ id: 1 }]);
  await store.dispatch(fetchRooms());
  assert.equal(store.getState().rooms.requests.list.status, "succeeded");
  http.defaults.adapter = async () => { throw { status: 503, message: "Missing token" }; };
  await store.dispatch(fetchRooms());
  assert.equal(store.getState().rooms.requests.list.error?.message, "Missing token");
});
test("location selection fetches only its rooms and ignores stale results", async () => {
  const room = { id: 12, maViTri: 7, tenPhong: "Phòng tại Quận 1" } as Room;
  const calls: InternalAxiosRequestConfig[] = [];
  http.defaults.adapter = async (config) => {
    calls.push(config);
    return response(config, config.params?.maViTri === 7 ? [room] : []);
  };

  const store = makeStore();
  await store.dispatch(fetchRoomsByLocation(7));
  assert.equal(calls[0].url, "/phong-thue/lay-phong-theo-vi-tri");
  assert.equal(calls[0].params.maViTri, 7);
  assert.deepEqual(store.getState().locationRooms.items.map((item) => item.id), [12]);
  assert.equal(store.getState().rooms.items.length, 0);

  store.dispatch(fetchRoomsByLocation.pending("older", 8));
  store.dispatch(fetchRoomsByLocation.pending("newer", 9));
  store.dispatch(fetchRoomsByLocation.fulfilled([room], "older", 8));
  assert.equal(store.getState().locationRooms.locationId, 9);
  assert.equal(store.getState().locationRooms.items.length, 0);
  store.dispatch(fetchRoomsByLocation.fulfilled([], "newer", 9));
  assert.equal(store.getState().locationRooms.status, "succeeded");
  assert.equal(store.getState().locationRooms.items.length, 0);
});
test("login removes unexpected password; logout clears private state and keeps the public catalogue", async () => {
  http.defaults.adapter = async (config) => response(config, { user: { id: 1, name: "Guest", role: "USER", password: "must-not-store" }, token: "session-token" });
  const store = makeStore(); await store.dispatch(login({ email: "guest@example.com", password: "test-only" }));
  assert.equal(store.getState().auth.token, "session-token");
  assert.ok(!("password" in store.getState().auth.user!));
  const room = { id: 2, tenPhong: "Public room" } as Room;
  const location = { id: 3, tenViTri: "Public location" } as Location;
  store.dispatch(fetchRooms.pending("catalogue", undefined));
  store.dispatch(fetchRooms.fulfilled(toPage([room]), "catalogue", undefined));
  store.dispatch(fetchLocations.pending("locations", undefined));
  store.dispatch(fetchLocations.fulfilled(toPage([location]), "locations", undefined));
  store.dispatch(logout());
  assert.equal(store.getState().auth.token, null);
  assert.equal(store.getState().auth.hydrated, true);
  assert.equal(store.getState().rooms.items[0].id, room.id);
  assert.equal(store.getState().locations.items[0].id, location.id);
  assert.equal(store.getState().bookings.items.length, 0);
  assert.equal(store.getState().users.items.length, 0);
});

