import assert from "node:assert/strict";
import { afterEach, test } from "node:test";
import type { AxiosAdapter, InternalAxiosRequestConfig } from "axios";
import { http, api } from "../app/lib/api/http";
import { toPage, unwrapResponse } from "../app/lib/api/response";
import { usersService } from "../app/features/users/users.service";
import { roomsService } from "../app/features/rooms/rooms.service";
import { makeStore } from "../app/store";
import { roomsThunks } from "../app/features/rooms/rooms.thunks";
import { login } from "../app/features/auth/auth.thunks";
import { logout } from "../app/features/auth/auth.slice";
import type { Room } from "../app/features/rooms/rooms.types";

const original = http.defaults.adapter;
afterEach(() => { http.defaults.adapter = original; });
const response = (config: InternalAxiosRequestConfig, content: unknown) => ({ data: { statusCode: 200, content }, status: 200, statusText: "OK", headers: {}, config });
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
  await store.dispatch(roomsThunks.patch({ id: 1, data: { wifi: true } }));
  assert.equal(store.getState().rooms.requests.patch.error?.status, 405);
});
test("stores are isolated; stale results and aborted requests cannot overwrite newer data", async () => {
  const first = makeStore(); const second = makeStore();
  const room = { id: 2, tenPhong: "Latest" } as Room;
  first.dispatch(roomsThunks.list.pending("old", undefined));
  first.dispatch(roomsThunks.list.pending("new", undefined));
  first.dispatch(roomsThunks.list.fulfilled(toPage([room]), "new", undefined));
  first.dispatch(roomsThunks.list.fulfilled(toPage([{ id: 1 } as Room]), "old", undefined));
  assert.equal(first.getState().rooms.items[0].id, 2);
  assert.equal(second.getState().rooms.items.length, 0);
  first.dispatch(roomsThunks.detail.pending("abort", 1));
  first.dispatch(roomsThunks.detail.rejected({ name: "AbortError", message: "Aborted" }, "abort", 1));
  assert.equal(first.getState().rooms.requests.detail.status, "idle");
  first.dispatch(logout());
  first.dispatch(roomsThunks.list.fulfilled(toPage([room]), "new", undefined));
  assert.equal(first.getState().rooms.items.length, 0);
});
test("real thunk dispatch transitions through pending, fulfillment and normalized failure", async () => {
  const store = makeStore();
  http.defaults.adapter = async (config) => response(config, [{ id: 1 }]);
  await store.dispatch(roomsThunks.list());
  assert.equal(store.getState().rooms.requests.list.status, "succeeded");
  http.defaults.adapter = async () => { throw { status: 503, message: "Missing token" }; };
  await store.dispatch(roomsThunks.list());
  assert.equal(store.getState().rooms.requests.list.error?.message, "Missing token");
});
test("login removes unexpected password from profile, logout resets every feature", async () => {
  http.defaults.adapter = async (config) => response(config, { user: { id: 1, name: "Guest", role: "USER", password: "must-not-store" }, token: "session-token" });
  const store = makeStore(); await store.dispatch(login({ email: "guest@example.com", password: "test-only" }));
  assert.equal(store.getState().auth.token, "session-token");
  assert.ok(!("password" in store.getState().auth.user!));
  store.dispatch(logout());
  assert.equal(store.getState().auth.token, null);
});

