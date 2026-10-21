import type { Booking } from "@/features/bookings/bookings.types";
import { available, type Search } from "@/features/reservations/flow";
import type { AmenityKey } from "./room-amenities";
import type { Room } from "./rooms.types";

export type SortOrder = "recommended" | "price-low" | "price-high" | "capacity";
export type RoomFiltersValue = {
  bedrooms: "all" | "1" | "2" | "3";
  amenities: AmenityKey[];
  maxPrice: number | null;
};

export const initialRoomFilters: RoomFiltersValue = {
  bedrooms: "all",
  amenities: [],
  maxPrice: null,
};

export function filterRooms(rooms: readonly Room[], options: {
  filters: RoomFiltersValue;
  sortOrder: SortOrder;
  locationId?: number;
  search?: Search | null;
  bookings: Booking[];
}) {
  const { filters, sortOrder, locationId, search, bookings } = options;

  // filter tạo mảng mới, nên sort bên dưới không thay đổi mảng trong Redux.
  const result = rooms.filter((room) => {
    const matchesLocation = locationId === undefined || room.maViTri === locationId;
    const matchesStay = !search || available(room, search, bookings);
    const matchesBedrooms = filters.bedrooms === "all" ||
      (filters.bedrooms === "3" ? room.phongNgu >= 3 : room.phongNgu === Number(filters.bedrooms));
    const matchesPrice = filters.maxPrice === null || room.giaTien <= filters.maxPrice;
    const matchesAmenities = filters.amenities.every((key) => room[key] === true);

    return matchesLocation && matchesStay && matchesBedrooms && matchesPrice && matchesAmenities;
  });

  if (sortOrder === "price-low") result.sort((first, second) => first.giaTien - second.giaTien);
  if (sortOrder === "price-high") result.sort((first, second) => second.giaTien - first.giaTien);
  if (sortOrder === "capacity") result.sort((first, second) => second.khach - first.khach);
  return result;
}
