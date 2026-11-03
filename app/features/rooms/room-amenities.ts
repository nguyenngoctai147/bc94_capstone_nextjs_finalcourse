import type { Room } from "./rooms.types";

export type AmenityKey = {
  [Key in keyof Room]: Room[Key] extends boolean ? Key : never;
}[keyof Room];

export const roomAmenities: readonly { key: AmenityKey; label: string }[] = [
  { key: "wifi", label: "Wi-Fi" },
  { key: "dieuHoa", label: "Điều hòa" },
  { key: "bep", label: "Bếp" },
  { key: "mayGiat", label: "Máy giặt" },
  { key: "tivi", label: "TV" },
  { key: "doXe", label: "Chỗ đỗ xe" },
  { key: "hoBoi", label: "Hồ bơi" },
  { key: "banLa", label: "Bàn là" },
  { key: "banUi", label: "Bàn ủi" },
];
