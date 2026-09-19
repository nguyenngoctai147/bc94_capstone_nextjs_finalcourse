export type Booking = {
  id: number; maPhong: number; ngayDen: string; ngayDi: string; soLuongKhach: number; maNguoiDung: number;
};
export type CreateBooking = Omit<Booking, "id">;
export type UpdateBooking = CreateBooking;
