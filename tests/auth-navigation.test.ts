import assert from "node:assert/strict";
import test from "node:test";
import { getLoginHref, getPostLoginPath, getSafeReturnPath, isAdminRole } from "../app/features/auth/auth-navigation";

test("booking login redirect keeps only safe internal return paths", () => {
  assert.equal(
    getLoginHref("/reservation/availability?maPhong=7"),
    "/login?next=%2Freservation%2Favailability%3FmaPhong%3D7",
  );
  assert.equal(
    getSafeReturnPath("/reservation/booking", "/reservation/availability"),
    "/reservation/booking",
  );
  assert.equal(
    getSafeReturnPath("https://example.com", "/reservation/availability"),
    "/reservation/availability",
  );
  assert.equal(
    getSafeReturnPath("//example.com", "/reservation/availability"),
    "/reservation/availability",
  );
});

test("post-login navigation always separates admin and customer routes", () => {
  assert.equal(isAdminRole(" admin "), true);
  assert.equal(getPostLoginPath("ADMIN", "/reservation/booking"), "/admin");
  assert.equal(getPostLoginPath("USER", "/reservation/booking"), "/reservation/booking");
  assert.equal(getPostLoginPath("USER", "/admin/rooms"), "/");
  assert.equal(getPostLoginPath("USER", "https://example.com"), "/");
  assert.equal(getPostLoginPath("USER", null), "/");
});
