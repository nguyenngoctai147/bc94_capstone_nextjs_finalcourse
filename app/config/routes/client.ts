import {
  ABOUT_PAGE,
  ACCOUNT_PAGE,
  BLOG_PAGE,
  BOOKINGS_PAGE,
  CONTACT_PAGE,
  HOME_PAGE,
  HOME_NAMED_PAGE,
  ROOM_DETAIL_PAGE,
  RESERVATION_STEPS,
  ROOMS_PAGE,
  UI_PAGE,
} from "./web";

export const clientRoutes = {
  home: HOME_PAGE,
  /** The named home page is kept for links that should point directly to /trang-chu. */
  homePage: HOME_NAMED_PAGE,
  rooms: {
    list: ROOMS_PAGE,
    detail: ROOM_DETAIL_PAGE,
  },
  bookings: BOOKINGS_PAGE,
  reservation: RESERVATION_STEPS,
  account: ACCOUNT_PAGE,
  pages: {
    about: ABOUT_PAGE,
    blog: BLOG_PAGE,
    contact: CONTACT_PAGE,
    ui: UI_PAGE,
  },
} as const;
