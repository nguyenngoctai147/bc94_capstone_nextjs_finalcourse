import assert from "node:assert/strict";
import test from "node:test";
import {
  adminBookingFormSchema,
  initialAdminBookingFormValues,
  toAdminBookingFormValues,
  toCreateBooking,
  toUpdateBooking,
} from "../app/features/bookings/booking-admin-form";
import type { Room } from "../app/features/rooms/rooms.types";
import { validate } from "../app/lib/validation/rules";

const room = { id: 3, khach: 4 } as Room;

test("admin booking form validates references, dates and room capacity", () => {
  const missing = validate(
    initialAdminBookingFormValues,
    adminBookingFormSchema([room]),
  );
  assert.ok(missing.maPhong);
  assert.ok(missing.maNguoiDung);
  assert.ok(missing.ngayDen);
  assert.ok(missing.ngayDi);

  const tooManyGuests = validate(
    {
      maPhong: "3",
      maNguoiDung: "7",
      ngayDen: "2099-01-10",
      ngayDi: "2099-01-12",
      soLuongKhach: "5",
    },
    adminBookingFormSchema([room]),
  );
  assert.ok(tooManyGuests.soLuongKhach);
});

test("admin booking form creates POST and complete PUT payloads", () => {
  const values = {
    maPhong: "3",
    maNguoiDung: "7",
    ngayDen: "2099-01-10",
    ngayDi: "2099-01-12",
    soLuongKhach: "2",
  };
  const createPayload = {
    maPhong: 3,
    maNguoiDung: 7,
    ngayDen: "2099-01-10T00:00:00",
    ngayDi: "2099-01-12T00:00:00",
    soLuongKhach: 2,
  };

  assert.deepEqual(validate(values, adminBookingFormSchema([room])), {});
  assert.deepEqual(toCreateBooking(values), createPayload);
  assert.deepEqual(
    toUpdateBooking(91, { ...values, maNguoiDung: "999" }, 7),
    { id: 91, ...createPayload },
  );
  assert.deepEqual(
    toAdminBookingFormValues({ id: 91, ...createPayload }),
    values,
  );
});
