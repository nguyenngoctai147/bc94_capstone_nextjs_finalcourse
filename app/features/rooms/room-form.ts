import { httpUrl, positiveInteger, required, type ValidationSchema } from "@/commons/validation/rules";
import { resolveApiImageSrc } from "@/commons/images";
import { roomAmenities, type AmenityKey } from "./room-amenities";
import type { CreateRoom, Room, UpdateRoom } from "@/store/type/room";

type AmenityValues = Record<AmenityKey, string>;

export type RoomFormValues = {
  tenPhong: string;
  khach: string;
  phongNgu: string;
  giuong: string;
  phongTam: string;
  moTa: string;
  giaTien: string;
  maViTri: string;
  hinhAnh: string;
} & AmenityValues;

const initialAmenityValues = Object.fromEntries(
  roomAmenities.map(({ key }) => [key, "false"]),
) as AmenityValues;

export const initialRoomFormValues: RoomFormValues = {
  tenPhong: "",
  khach: "1",
  phongNgu: "1",
  giuong: "1",
  phongTam: "1",
  moTa: "",
  giaTien: "",
  maViTri: "",
  hinhAnh: "",
  ...initialAmenityValues,
};

export const roomFormSchema: ValidationSchema<RoomFormValues> = {
  tenPhong: [required("Vui lòng nhập tên phòng.")],
  khach: [required(), positiveInteger],
  phongNgu: [required(), positiveInteger],
  giuong: [required(), positiveInteger],
  phongTam: [required(), positiveInteger],
  moTa: [required("Vui lòng nhập mô tả phòng.")],
  giaTien: [required("Vui lòng nhập giá phòng."), positiveInteger],
  maViTri: [required("Vui lòng chọn vị trí."), positiveInteger],
  hinhAnh: [
    httpUrl,
    (value) => !value || resolveApiImageSrc(value) ? undefined : "URL ảnh chưa được cấu hình để hiển thị trong website.",
  ],
};

export const toCreateRoom = (values: RoomFormValues): CreateRoom => {
  const amenities = roomAmenities.reduce<Pick<CreateRoom, AmenityKey>>(
    (result, { key }) => ({ ...result, [key]: values[key] === "true" }),
    {} as Pick<CreateRoom, AmenityKey>,
  );

  return {
    tenPhong: values.tenPhong.trim(),
    khach: Number(values.khach),
    phongNgu: Number(values.phongNgu),
    giuong: Number(values.giuong),
    phongTam: Number(values.phongTam),
    moTa: values.moTa.trim(),
    giaTien: Number(values.giaTien),
    maViTri: Number(values.maViTri),
    hinhAnh: values.hinhAnh.trim(),
    ...amenities,
  };
};

export const toRoomFormValues = (room: Room): RoomFormValues => ({
  tenPhong: room.tenPhong,
  khach: String(room.khach),
  phongNgu: String(room.phongNgu),
  giuong: String(room.giuong),
  phongTam: String(room.phongTam),
  moTa: room.moTa,
  giaTien: String(room.giaTien),
  maViTri: String(room.maViTri),
  hinhAnh: room.hinhAnh,
  ...roomAmenities.reduce<AmenityValues>(
    (result, { key }) => ({ ...result, [key]: String(room[key]) }),
    {} as AmenityValues,
  ),
});

export const toUpdateRoom = (
  id: number,
  values: RoomFormValues,
): UpdateRoom => ({ id, ...toCreateRoom(values) });
