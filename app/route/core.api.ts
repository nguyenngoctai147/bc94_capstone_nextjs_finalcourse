const backendPath = (path: string) => `/${path}`;
const withId = (base: string, id: number | string) =>
  `${base}/${encodeURIComponent(id)}`;

export const CORE_SIGNIN_ENDPOINT = backendPath("auth/signin");
export const CORE_SIGNUP_ENDPOINT = backendPath("auth/signup");
export const CORE_LOGIN_ENDPOINT = CORE_SIGNIN_ENDPOINT;

export const CORE_USERS_ENDPOINT = backendPath("users");
export const CORE_USER_DETAIL_ENDPOINT = (id: number | string) =>
  withId(CORE_USERS_ENDPOINT, id);
export const CORE_USER_SEARCH_ENDPOINT = backendPath(
  "users/phan-trang-tim-kiem",
);
export const CORE_USER_BY_NAME_ENDPOINT = (name: string) =>
  `${CORE_USERS_ENDPOINT}/search/${encodeURIComponent(name)}`;
export const CORE_USER_UPLOAD_AVATAR_ENDPOINT = backendPath(
  "users/upload-avatar",
);

export const CORE_ROOMS_ENDPOINT = backendPath("phong-thue");
export const CORE_ROOM_DETAIL_ENDPOINT = (id: number | string) =>
  withId(CORE_ROOMS_ENDPOINT, id);
export const CORE_ROOM_SEARCH_ENDPOINT = backendPath(
  "phong-thue/phan-trang-tim-kiem",
);
export const CORE_ROOM_BY_LOCATION_ENDPOINT = backendPath(
  "phong-thue/lay-phong-theo-vi-tri",
);
export const CORE_ROOM_UPLOAD_IMAGE_ENDPOINT = backendPath(
  "phong-thue/upload-hinh-phong",
);

export const CORE_BOOKINGS_ENDPOINT = backendPath("dat-phong");
export const CORE_BOOKING_DETAIL_ENDPOINT = (id: number | string) =>
  withId(CORE_BOOKINGS_ENDPOINT, id);
export const CORE_BOOKING_BY_USER_ENDPOINT = (id: number | string) =>
  `${CORE_BOOKINGS_ENDPOINT}/lay-theo-nguoi-dung/${encodeURIComponent(id)}`;

export const CORE_LOCATIONS_ENDPOINT = backendPath("vi-tri");
export const CORE_LOCATION_DETAIL_ENDPOINT = (id: number | string) =>
  withId(CORE_LOCATIONS_ENDPOINT, id);
export const CORE_LOCATION_SEARCH_ENDPOINT = backendPath(
  "vi-tri/phan-trang-tim-kiem",
);
export const CORE_LOCATION_UPLOAD_IMAGE_ENDPOINT = backendPath(
  "vi-tri/upload-hinh-vitri",
);

export const CORE_REVIEWS_ENDPOINT = backendPath("binh-luan");
export const CORE_REVIEW_DETAIL_ENDPOINT = (id: number | string) =>
  withId(CORE_REVIEWS_ENDPOINT, id);
export const CORE_REVIEW_BY_ROOM_ENDPOINT = (id: number | string) =>
  `${CORE_REVIEWS_ENDPOINT}/lay-binh-luan-theo-phong/${encodeURIComponent(id)}`;

export const coreApi = {
  auth: {
    signin: CORE_SIGNIN_ENDPOINT,
    signup: CORE_SIGNUP_ENDPOINT,
  },
  user: {
    base: CORE_USERS_ENDPOINT,
    detail: CORE_USER_DETAIL_ENDPOINT,
    search: CORE_USER_SEARCH_ENDPOINT,
    byName: CORE_USER_BY_NAME_ENDPOINT,
    uploadAvatar: CORE_USER_UPLOAD_AVATAR_ENDPOINT,
  },
  profile: {
    detail: CORE_USER_DETAIL_ENDPOINT,
  },
  room: {
    base: CORE_ROOMS_ENDPOINT,
    detail: CORE_ROOM_DETAIL_ENDPOINT,
    search: CORE_ROOM_SEARCH_ENDPOINT,
    byLocation: CORE_ROOM_BY_LOCATION_ENDPOINT,
    uploadImage: CORE_ROOM_UPLOAD_IMAGE_ENDPOINT,
  },
  booking: {
    base: CORE_BOOKINGS_ENDPOINT,
    detail: CORE_BOOKING_DETAIL_ENDPOINT,
    byUser: CORE_BOOKING_BY_USER_ENDPOINT,
  },
  location: {
    base: CORE_LOCATIONS_ENDPOINT,
    detail: CORE_LOCATION_DETAIL_ENDPOINT,
    search: CORE_LOCATION_SEARCH_ENDPOINT,
    uploadImage: CORE_LOCATION_UPLOAD_IMAGE_ENDPOINT,
  },
  reviews: {
    base: CORE_REVIEWS_ENDPOINT,
    detail: CORE_REVIEW_DETAIL_ENDPOINT,
    byRoom: CORE_REVIEW_BY_ROOM_ENDPOINT,
  },
} as const;
