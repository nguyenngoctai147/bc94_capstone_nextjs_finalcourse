import assert from "node:assert/strict";
import test from "node:test";
import { email, required, validate, validDate } from "../app/lib/validation/rules";
import { bookingSchema } from "../app/features/bookings/booking.validation";
test("validation catches blank fields, malformed emails and impossible calendar dates", () => {
  assert.equal(Object.keys(validate({ email: "" }, { email: [required(), email] })).length, 1);
  assert.equal(email("guest@example.com"), undefined);
  assert.ok(email("not-an-email"));
  assert.ok(validDate("2026-02-30"));
  assert.equal(validDate("2028-02-29"), undefined);
});
test("booking requires checkout after checkin and capacity within limits", () => {
  const values = { ngayDen: "2099-01-10", ngayDi: "2099-01-10", soLuongKhach: "4" };
  const errors = validate(values, bookingSchema(2));
  assert.ok(errors.ngayDi); assert.ok(errors.soLuongKhach);
  assert.deepEqual(validate({ ...values, ngayDi: "2099-01-11", soLuongKhach: "2" }, bookingSchema(2)), {});
  assert.ok(validate({ ...values, ngayDen: "2000-01-01" }, bookingSchema(2)).ngayDen);
});

