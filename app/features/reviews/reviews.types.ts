export type Review = {
  id: number; maPhong: number; maNguoiBinhLuan: number; ngayBinhLuan: string; noiDung: string; saoBinhLuan: number;
};
export type RoomReview = { id: number; ngayBinhLuan: string; noiDung: string; saoBinhLuan: number; tenNguoiBinhLuan: string; avatar: string };
export type CreateReview = Omit<Review, "id">;
export type UpdateReview = CreateReview;
