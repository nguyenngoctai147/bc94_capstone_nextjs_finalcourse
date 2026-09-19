import { localToday, positiveInteger, required, validDate, type ValidationSchema } from "@/lib/validation/rules";
export type BookingFormValues = { ngayDen: string; ngayDi: string; soLuongKhach: string };
export const bookingSchema = (capacity: number): ValidationSchema<BookingFormValues> => ({
  ngayDen: [required(), validDate, (value) => value >= localToday() ? undefined : "Ngày nhận phòng không được ở quá khứ."],
  ngayDi: [required(), validDate, (value, values) => value > values.ngayDen ? undefined : "Ngày trả phòng phải sau ngày nhận phòng."],
  soLuongKhach: [required(), positiveInteger, (value) => Number(value) <= capacity ? undefined : `Phòng tối đa ${capacity} khách.`],
});
