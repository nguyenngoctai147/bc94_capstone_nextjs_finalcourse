import type { Room } from "./rooms.types";

export type AmenityKey = {
  [Key in keyof Room]: Room[Key] extends boolean ? Key : never;
}[keyof Room];

/** The same names and available facilities are used in filters and room details. */
export const roomAmenities: readonly { key: AmenityKey; label: string; icon: string }[] = [
  { key: "wifi", label: "Wi-Fi", icon: "fa-wifi" },
  { key: "dieuHoa", label: "Điều hòa", icon: "fa-snowflake-o" },
  { key: "bep", label: "Bếp", icon: "fa-cutlery" },
  { key: "mayGiat", label: "Máy giặt", icon: "fa-tint" },
  { key: "tivi", label: "TV", icon: "fa-television" },
  { key: "doXe", label: "Chỗ đỗ xe", icon: "fa-car" },
  { key: "hoBoi", label: "Hồ bơi", icon: "fa-life-ring" },
  { key: "banLa", label: "Bàn là", icon: "fa-check" },
  { key: "banUi", label: "Bàn ủi", icon: "fa-check" },
];
