export type Location = { id: number; tenViTri: string; tinhThanh: string; quocGia: string; hinhAnh: string };
export type CreateLocation = Omit<Location, "id">;
export type UpdateLocation = CreateLocation;
