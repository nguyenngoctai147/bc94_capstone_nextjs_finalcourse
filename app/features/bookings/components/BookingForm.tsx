"use client";
import { useState } from "react";
import Link from "next/link";
import { Alert, Button, Input } from "@/components/ui";
import { useForm } from "@/hooks/useForm";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { routes } from "@/config/routes";
import type { Room } from "@/features/rooms/rooms.types";
import { bookingsThunks } from "../bookings.thunks";
import { bookingSchema } from "../booking.validation";
export function BookingForm({ room }: { room: Room }) {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const [result, setResult] = useState<{ ok: boolean; message: string } | null>(
    null,
  );
  const form = useForm(
    { ngayDen: "", ngayDi: "", soLuongKhach: "1" },
    bookingSchema(room.khach),
  );
  return (
    <form
      noValidate
      onSubmit={form.handleSubmit(async (values) => {
        if (!user) return;
        setResult(null);
        const action = await dispatch(
          bookingsThunks.create({
            maPhong: room.id,
            maNguoiDung: user.id,
            soLuongKhach: Number(values.soLuongKhach),
            ngayDen: `${values.ngayDen}T00:00:00`,
            ngayDi: `${values.ngayDi}T00:00:00`,
          }),
        );
        if (bookingsThunks.create.fulfilled.match(action)) {
          setResult({ ok: true, message: "Đặt phòng thành công." });
          form.reset();
        } else
          setResult({
            ok: false,
            message: action.payload?.message ?? "Đặt phòng thất bại.",
          });
      })}
    >
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
        {...form.field("ngayDen")}
      />
      <Input label="Trả phòng" type="date" required {...form.field("ngayDi")} />
      <Input
        label="Số khách"
        type="number"
        min={1}
        max={room.khach}
        required
        {...form.field("soLuongKhach")}
      />
      <Button type="submit" loading={form.submitting} className="w-100">
        Đặt phòng
      </Button>
    </form>
  );
}
