const nextApiPath = (path: string) => `/api/${path}`;
const withId = (base: string, id: number | string) =>
  `${base}/${encodeURIComponent(id)}`;

export const NEXT_SIGNIN_ENDPOINT = nextApiPath("auth/signin");
export const NEXT_SIGNUP_ENDPOINT = nextApiPath("auth/signup");
export const NEXT_SIGNOUT_ENDPOINT = nextApiPath("auth/signout");
export const NEXT_LOGIN_ENDPOINT = NEXT_SIGNIN_ENDPOINT;

export const NEXT_USERS_ENDPOINT = nextApiPath("user");
export const NEXT_USER_DETAIL_ENDPOINT = (id: number | string) =>
  withId(NEXT_USERS_ENDPOINT, id);
export const NEXT_USER_SEARCH_ENDPOINT = `${NEXT_USERS_ENDPOINT}/phan-trang-tim-kiem`;
export const NEXT_USER_BY_NAME_ENDPOINT = (name: string) =>
  `${NEXT_USERS_ENDPOINT}/search/${encodeURIComponent(name)}`;
export const NEXT_USER_UPLOAD_AVATAR_ENDPOINT = `${NEXT_USERS_ENDPOINT}/upload-avatar`;

export const NEXT_PROFILE_ENDPOINT = nextApiPath("profile");
export const NEXT_PROFILE_DETAIL_ENDPOINT = (id: number | string) =>
  withId(NEXT_PROFILE_ENDPOINT, id);

export const NEXT_ROOMS_ENDPOINT = nextApiPath("room");
export const NEXT_ROOM_DETAIL_ENDPOINT = (id: number | string) =>
  withId(NEXT_ROOMS_ENDPOINT, id);
export const NEXT_ROOM_SEARCH_ENDPOINT = `${NEXT_ROOMS_ENDPOINT}/phan-trang-tim-kiem`;
export const NEXT_ROOM_BY_LOCATION_ENDPOINT = `${NEXT_ROOMS_ENDPOINT}/lay-phong-theo-vi-tri`;
export const NEXT_ROOM_UPLOAD_IMAGE_ENDPOINT = `${NEXT_ROOMS_ENDPOINT}/upload-hinh-phong`;

export const NEXT_BOOKINGS_ENDPOINT = nextApiPath("booking");
export const NEXT_BOOKING_DETAIL_ENDPOINT = (id: number | string) =>
  withId(NEXT_BOOKINGS_ENDPOINT, id);
export const NEXT_BOOKING_BY_USER_ENDPOINT = (id: number | string) =>
  `${NEXT_BOOKINGS_ENDPOINT}/lay-theo-nguoi-dung/${encodeURIComponent(id)}`;

export const NEXT_LOCATIONS_ENDPOINT = nextApiPath("location");
export const NEXT_LOCATION_DETAIL_ENDPOINT = (id: number | string) =>
  withId(NEXT_LOCATIONS_ENDPOINT, id);
export const NEXT_LOCATION_SEARCH_ENDPOINT = `${NEXT_LOCATIONS_ENDPOINT}/phan-trang-tim-kiem`;
export const NEXT_LOCATION_UPLOAD_IMAGE_ENDPOINT = `${NEXT_LOCATIONS_ENDPOINT}/upload-hinh-vitri`;

export const NEXT_REVIEWS_ENDPOINT = nextApiPath("reviews");
export const NEXT_REVIEW_DETAIL_ENDPOINT = (id: number | string) =>
  withId(NEXT_REVIEWS_ENDPOINT, id);
export const NEXT_REVIEW_BY_ROOM_ENDPOINT = (id: number | string) =>
  `${NEXT_REVIEWS_ENDPOINT}/lay-binh-luan-theo-phong/${encodeURIComponent(id)}`;

export const nextApi = {
  auth: {
    signin: NEXT_SIGNIN_ENDPOINT,
    signup: NEXT_SIGNUP_ENDPOINT,
    signout: NEXT_SIGNOUT_ENDPOINT,
  },
  user: {
    base: NEXT_USERS_ENDPOINT,
    detail: NEXT_USER_DETAIL_ENDPOINT,
    search: NEXT_USER_SEARCH_ENDPOINT,
    byName: NEXT_USER_BY_NAME_ENDPOINT,
    uploadAvatar: NEXT_USER_UPLOAD_AVATAR_ENDPOINT,
  },
  profile: {
    base: NEXT_PROFILE_ENDPOINT,
    detail: NEXT_PROFILE_DETAIL_ENDPOINT,
  },
  room: {
    base: NEXT_ROOMS_ENDPOINT,
    detail: NEXT_ROOM_DETAIL_ENDPOINT,
    search: NEXT_ROOM_SEARCH_ENDPOINT,
    byLocation: NEXT_ROOM_BY_LOCATION_ENDPOINT,
    uploadImage: NEXT_ROOM_UPLOAD_IMAGE_ENDPOINT,
  },
  booking: {
    base: NEXT_BOOKINGS_ENDPOINT,
    detail: NEXT_BOOKING_DETAIL_ENDPOINT,
    byUser: NEXT_BOOKING_BY_USER_ENDPOINT,
  },
  location: {
    base: NEXT_LOCATIONS_ENDPOINT,
    detail: NEXT_LOCATION_DETAIL_ENDPOINT,
    search: NEXT_LOCATION_SEARCH_ENDPOINT,
    uploadImage: NEXT_LOCATION_UPLOAD_IMAGE_ENDPOINT,
  },
  reviews: {
    base: NEXT_REVIEWS_ENDPOINT,
    detail: NEXT_REVIEW_DETAIL_ENDPOINT,
    byRoom: NEXT_REVIEW_BY_ROOM_ENDPOINT,
  },
} as const;
