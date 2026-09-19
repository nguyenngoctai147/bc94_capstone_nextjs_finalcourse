import { authEndpoints } from "./auth";
import { bookingEndpoints } from "./bookings";
import { locationEndpoints } from "./locations";
import { reviewEndpoints } from "./reviews";
import { roomEndpoints } from "./rooms";
import { userEndpoints } from "./users";

// Backend paths, relative to API_BASE_URL. Keep Swagger names in one registry.
export const CORE_LOGIN_ENDPOINT = authEndpoints.login;
export const CORE_SIGNUP_ENDPOINT = authEndpoints.register;

export const CORE_ROOMS_ENDPOINT = roomEndpoints.base;
export const CORE_ROOM_DETAIL_ENDPOINT = roomEndpoints.detail;
export const CORE_ROOM_SEARCH_ENDPOINT = roomEndpoints.search;
export const CORE_ROOM_BY_LOCATION_ENDPOINT = roomEndpoints.byLocation;
export const CORE_ROOM_UPLOAD_IMAGE_ENDPOINT = roomEndpoints.uploadImage;

export const CORE_BOOKINGS_ENDPOINT = bookingEndpoints.base;
export const CORE_BOOKING_DETAIL_ENDPOINT = bookingEndpoints.detail;
export const CORE_BOOKING_BY_USER_ENDPOINT = bookingEndpoints.byUser;

export const CORE_LOCATIONS_ENDPOINT = locationEndpoints.base;
export const CORE_LOCATION_DETAIL_ENDPOINT = locationEndpoints.detail;
export const CORE_LOCATION_SEARCH_ENDPOINT = locationEndpoints.search;
export const CORE_LOCATION_UPLOAD_IMAGE_ENDPOINT = locationEndpoints.uploadImage;

export const CORE_USERS_ENDPOINT = userEndpoints.base;
export const CORE_USER_DETAIL_ENDPOINT = userEndpoints.detail;
export const CORE_USER_SEARCH_ENDPOINT = userEndpoints.search;
export const CORE_USER_BY_NAME_ENDPOINT = userEndpoints.byName;
export const CORE_USER_UPLOAD_AVATAR_ENDPOINT = userEndpoints.uploadAvatar;

export const CORE_REVIEWS_ENDPOINT = reviewEndpoints.base;
export const CORE_REVIEW_DETAIL_ENDPOINT = reviewEndpoints.detail;
export const CORE_REVIEW_BY_ROOM_ENDPOINT = reviewEndpoints.byRoom;

export const coreApi = {
  auth: authEndpoints,
  rooms: roomEndpoints,
  bookings: bookingEndpoints,
  locations: locationEndpoints,
  users: userEndpoints,
  reviews: reviewEndpoints,
} as const;
