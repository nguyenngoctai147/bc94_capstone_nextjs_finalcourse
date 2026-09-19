export const HOME_PAGE = "/";
export const HOME_NAMED_PAGE = "/trang-chu";

export const ROOMS_PAGE = "/rooms";
export const ROOM_DETAIL_PAGE = (id: number | string) => `${ROOMS_PAGE}/${encodeURIComponent(id)}`;
export const BOOKINGS_PAGE = "/bookings";
export const RESERVATION_PAGE = "/reservation";
export const RESERVATION_STEPS = {
  availability: `${RESERVATION_PAGE}/availability`,
  selectRoom: `${RESERVATION_PAGE}/room-select`,
  booking: `${RESERVATION_PAGE}/booking`,
  confirmation: `${RESERVATION_PAGE}/confirmation`,
} as const;
export const ACCOUNT_PAGE = "/account";

export const ABOUT_PAGE = "/gioi-thieu";
export const BLOG_PAGE = "/blog";
export const CONTACT_PAGE = "/lien-he";
export const UI_PAGE = "/ui";
