import assert from "node:assert/strict";
import test from "node:test";
import { POST as signout } from "../app/api/auth/signout/route";
import { coreApi } from "../app/route/core.api";
import { nextApi } from "../app/route/next.api";

test("core and local API registries keep backend paths out of feature services", () => {
  assert.equal(coreApi.auth.signin, "/auth/signin");
  assert.equal(nextApi.auth.signin, "/api/auth/signin");
  assert.equal(coreApi.room.detail(12), "/phong-thue/12");
  assert.equal(nextApi.room.detail(12), "/api/room/12");
  assert.equal(coreApi.booking.byUser(7), "/dat-phong/lay-theo-nguoi-dung/7");
  assert.equal(nextApi.booking.byUser(7), "/api/booking/lay-theo-nguoi-dung/7");
  assert.equal(coreApi.profile.detail(9), "/users/9");
  assert.equal(nextApi.profile.detail(9), "/api/profile/9");
});

test("signout route completes the local server session without a body", async () => {
  const response = await signout();
  assert.equal(response.status, 204);
  assert.equal(await response.text(), "");
  assert.equal(response.headers.get("cache-control"), "no-store");
});
