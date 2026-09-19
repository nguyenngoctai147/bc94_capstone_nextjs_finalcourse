import { bookingEndpoints } from "./bookings";
import { locationEndpoints } from "./locations";
import { reviewEndpoints } from "./reviews";
import { roomEndpoints } from "./rooms";
import { userEndpoints } from "./users";

export const resourceEndpoints = {
  rooms: roomEndpoints.base,
  bookings: bookingEndpoints.base,
  users: userEndpoints.base,
  locations: locationEndpoints.base,
  reviews: reviewEndpoints.base,
} as const;
