import type { Booking } from "@/store/type/bookings";
import { available, type Search } from "@/features/reservations/flow";
import type { AmenityKey } from "./room-amenities";
import type { Room } from "@/store/type/room";

export type SortOrder = "recommended" | "price-low" | "price-high" | "capacity";
export type RoomFiltersValue = {
  bedrooms: "all" | "1" | "2" | "3";
  amenities: AmenityKey[];
  maxPrice: number | null;
  minRating: 1 | 2 | 3 | 4 | 5 | null;
};

export const initialRoomFilters: RoomFiltersValue = {
  bedrooms: "all",
  amenities: [],
  maxPrice: null,
  minRating: null,
};

export const RELATED_ROOM_LIMIT = 3;

export function selectRelatedRooms(
  currentRoom: Room,
  nearbyRooms: readonly Room[],
  fallbackRooms: readonly Room[],
  limit = RELATED_ROOM_LIMIT,
) {
  const selectedIds = new Set<number>([currentRoom.id]);
  const appendUniqueRooms = (rooms: readonly Room[], selected: Room[]) => {
    rooms.forEach((room) => {
      if (selected.length >= limit || selectedIds.has(room.id)) return;
      selected.push(room);
      selectedIds.add(room.id);
    });
  };

  const relatedRooms: Room[] = [];
  appendUniqueRooms(
    nearbyRooms.filter((room) => room.maViTri === currentRoom.maViTri),
    relatedRooms,
  );
  appendUniqueRooms(fallbackRooms, relatedRooms);
  return relatedRooms;
}

export function filterRooms(rooms: readonly Room[], options: {
  filters: RoomFiltersValue;
  sortOrder: SortOrder;
  locationId?: number;
  search?: Search | null;
  bookings: Booking[];
  ratingsByRoom?: ReadonlyMap<number, number>;
}) {
  const { filters, sortOrder, locationId, search, bookings, ratingsByRoom } = options;

  const result = rooms.filter((room) => {
    const matchesLocation = locationId === undefined || room.maViTri === locationId;
    const matchesStay = !search || available(room, search, bookings);
    const matchesBedrooms = filters.bedrooms === "all" ||
      (filters.bedrooms === "3" ? room.phongNgu >= 3 : room.phongNgu === Number(filters.bedrooms));
    const matchesPrice = filters.maxPrice === null || room.giaTien <= filters.maxPrice;
    const matchesAmenities = filters.amenities.every((key) => room[key] === true);
    const matchesRating = filters.minRating === null || !ratingsByRoom ||
      (ratingsByRoom.get(room.id) ?? 0) >= filters.minRating;

    return matchesLocation && matchesStay && matchesBedrooms && matchesPrice && matchesAmenities && matchesRating;
  });

  if (sortOrder === "price-low") result.sort((first, second) => first.giaTien - second.giaTien);
  if (sortOrder === "price-high") result.sort((first, second) => second.giaTien - first.giaTien);
  if (sortOrder === "capacity") result.sort((first, second) => second.khach - first.khach);
  return result;
}
