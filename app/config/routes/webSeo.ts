import { ABOUT_PAGE, ACCOUNT_PAGE, BLOG_PAGE, BOOKINGS_PAGE, CONTACT_PAGE, HOME_PAGE, ROOMS_PAGE } from "./web";

export const WEB_SEO_ROUTE = [
  { id: 1, path: HOME_PAGE },
  { id: 2, path: ABOUT_PAGE },
  { id: 3, path: BLOG_PAGE },
  { id: 4, path: CONTACT_PAGE },
  { id: 5, path: ROOMS_PAGE },
  { id: 6, path: BOOKINGS_PAGE },
  { id: 7, path: ACCOUNT_PAGE },
] as const;
