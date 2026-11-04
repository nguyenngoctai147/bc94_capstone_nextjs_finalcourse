import assert from "node:assert/strict";
import test from "node:test";
import { menuItems, routeIsActive } from "../app/component/admin/admin-navigation";
import { adminNavigation, adminRoutes } from "../app/route";

const expectedNavigation = [
  ["Tổng quan", adminRoutes.dashboard],
  ["Quản lý phòng", adminRoutes.rooms],
  ["Quản lý đặt phòng", adminRoutes.bookings],
  ["Quản lý vị trí", adminRoutes.locations],
  ["Quản lý người dùng", adminRoutes.users],
  ["Quản lý bình luận", adminRoutes.reviews],
];

test("admin sidebar only exposes resources supported by the Hotux API", () => {
  assert.deepEqual(
    menuItems.map(({ label, href }) => [label, href]),
    expectedNavigation,
  );
  assert.ok(menuItems.every((item) => item.href && !item.children));
});

test("admin route registry and rendered sidebar stay aligned", () => {
  assert.deepEqual(
    adminNavigation.map(({ label, href }) => [label, href]),
    expectedNavigation,
  );
});

test("admin active links respect path segments and the dashboard matches only its own page", () => {
  assert.equal(routeIsActive("/admin", adminRoutes.dashboard), true);
  assert.equal(routeIsActive("/admin/users", adminRoutes.dashboard), false);
  assert.equal(routeIsActive("/admin/users/detail", adminRoutes.users), true);
  assert.equal(routeIsActive("/admin/rooms/add", adminRoutes.rooms), true);
  assert.equal(adminRoutes.roomEdit(7), "/admin/rooms/7");
  assert.equal(routeIsActive("/admin/rooms/7", adminRoutes.rooms), true);
  assert.equal(adminRoutes.bookingEdit(91), "/admin/bookings/91");
  assert.equal(routeIsActive(adminRoutes.bookingEdit(91), adminRoutes.bookings), true);
  assert.equal(adminRoutes.locationAdd, "/admin/locations/add");
  assert.equal(routeIsActive(adminRoutes.locationAdd, adminRoutes.locations), true);
  assert.equal(adminRoutes.locationEdit(9), "/admin/locations/9");
  assert.equal(routeIsActive(adminRoutes.locationEdit(9), adminRoutes.locations), true);
  assert.equal(routeIsActive("/admin/users-other", adminRoutes.users), false);
  assert.equal(routeIsActive("/admin/users"), false);
});
