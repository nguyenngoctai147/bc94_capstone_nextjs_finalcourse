"use client";

import { useState } from "react";
import Link from "next/link";
import { Alert, Button, Input } from "@/component/ui";
import { useForm } from "@/hooks/useForm";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { routes } from "@/route";
import type { Room } from "@/store/type/room";
import { createBooking } from "@/store/thunk/bookings";
import { bookingSchema } from "../booking.validation";
import { bookingsService } from "../bookings.service";
import { available } from "@/features/reservations/flow";

export function BookingForm({ room }: { room: Room }) {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const token = useAppSelector((state) => state.auth.token);
  const [result, setResult] = useState<{ ok: boolean; message: string } | null>(
    null,
  );
  const form = useForm(
    { ngayDen: "", ngayDi: "", soLuongKhach: "1" },
    bookingSchema(room.khach),
  );
  const handleBooking = form.handleSubmit(async (values) => {
    if (!user || !token) return;
    setResult(null);

    try {
      const latest = await bookingsService.list({ token });
      const search = {
        checkIn: values.ngayDen,
        checkOut: values.ngayDi,
        guests: Number(values.soLuongKhach),
      };

      if (!available(room, search, latest.data)) {
        setResult({
          ok: false,
          message:
            "Phòng không còn trống trong khoảng ngày này hoặc vượt quá số khách cho phép.",
        });
        return;
      }
    } catch {
      setResult({
        ok: false,
        message: "Không thể kiểm tra phòng trống. Vui lòng thử lại.",
      });
      return;
    }

    const action = await dispatch(
      createBooking({
        maPhong: room.id,
        maNguoiDung: user.id,
        soLuongKhach: Number(values.soLuongKhach),
        ngayDen: `${values.ngayDen}T00:00:00`,
        ngayDi: `${values.ngayDi}T00:00:00`,
      }),
    );

    if (createBooking.fulfilled.match(action)) {
      setResult({ ok: true, message: "Đặt phòng thành công." });
      form.reset();
    } else {
      setResult({
        ok: false,
        message: action.payload?.message ?? "Đặt phòng thất bại.",
      });
    }
  });

  return (
    <form noValidate onSubmit={handleBooking}>
      {result && (
        <Alert variant={result.ok ? "success" : "danger"}>
          {result.message}
          {result.ok && (
            <>
              {" "}
              <Link href={routes.bookings}>Xem đặt phòng</Link>
            </>
          )}
        </Alert>
      )}
      <Input
        label="Nhận phòng"
        type="date"
        required
        name="ngayDen"
        value={form.values.ngayDen}
        error={form.errors.ngayDen}
        onChange={form.handleChange}
        onBlur={form.handleBlur}
      />
      <Input
        label="Trả phòng"
        type="date"
        required
        name="ngayDi"
        value={form.values.ngayDi}
        error={form.errors.ngayDi}
        onChange={form.handleChange}
        onBlur={form.handleBlur}
      />
      <Input
        label="Số khách"
        type="number"
        min={1}
        max={room.khach}
        required
        name="soLuongKhach"
        value={form.values.soLuongKhach}
        error={form.errors.soLuongKhach}
        onChange={form.handleChange}
        onBlur={form.handleBlur}
      />
      <Button type="submit" loading={form.submitting} className="w-100">
        Đặt phòng
      </Button>
    </form>
  );
}
