import assert from "node:assert/strict";
import test from "node:test";
import { menuItems, routeIsActive } from "../app/components/admin/admin-navigation";
import { adminNavigation, adminRoutes } from "../app/config/routes";

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
  assert.equal(routeIsActive("/admin/users-other", adminRoutes.users), false);
  assert.equal(routeIsActive("/admin/users"), false);
});
