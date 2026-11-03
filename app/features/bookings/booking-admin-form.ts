import type { Room } from "@/features/rooms/rooms.types";
import {
  localToday,
  positiveInteger,
  required,
  validDate,
  type ValidationSchema,
} from "@/lib/validation/rules";
import type { Booking, CreateBooking, UpdateBooking } from "./bookings.types";

export type AdminBookingFormValues = {
  maPhong: string;
  maNguoiDung: string;
  ngayDen: string;
  ngayDi: string;
  soLuongKhach: string;
};

export const initialAdminBookingFormValues: AdminBookingFormValues = {
  maPhong: "",
  maNguoiDung: "",
  ngayDen: "",
  ngayDi: "",
  soLuongKhach: "1",
};

export const adminBookingFormSchema = (
  rooms: readonly Room[],
): ValidationSchema<AdminBookingFormValues> => ({
  maPhong: [required("Vui lòng chọn phòng."), positiveInteger],
  maNguoiDung: [required("Vui lòng chọn khách hàng."), positiveInteger],
  ngayDen: [
    required(),
    validDate,
    (value) =>
      value >= localToday()
        ? undefined
        : "Ngày nhận phòng không được ở quá khứ.",
  ],
  ngayDi: [
    required(),
    validDate,
    (value, values) =>
      value > values.ngayDen
        ? undefined
        : "Ngày trả phòng phải sau ngày nhận phòng.",
  ],
  soLuongKhach: [
    required(),
    positiveInteger,
    (value, values) => {
      const room = rooms.find((item) => item.id === Number(values.maPhong));
      return !room || Number(value) <= room.khach
        ? undefined
        : `Phòng tối đa ${room.khach} khách.`;
    },
  ],
});

export const toCreateBooking = (
  values: AdminBookingFormValues,
): CreateBooking => ({
  maPhong: Number(values.maPhong),
  maNguoiDung: Number(values.maNguoiDung),
  ngayDen: `${values.ngayDen}T00:00:00`,
  ngayDi: `${values.ngayDi}T00:00:00`,
  soLuongKhach: Number(values.soLuongKhach),
});

export const toAdminBookingFormValues = (
  booking: Booking,
): AdminBookingFormValues => ({
  maPhong: String(booking.maPhong),
  maNguoiDung: String(booking.maNguoiDung),
  ngayDen: booking.ngayDen.slice(0, 10),
  ngayDi: booking.ngayDi.slice(0, 10),
  soLuongKhach: String(booking.soLuongKhach),
});

export const toUpdateBooking = (
  id: number,
  values: AdminBookingFormValues,
  customerId: number,
): UpdateBooking => ({
  id,
  ...toCreateBooking({ ...values, maNguoiDung: String(customerId) }),
});
