export { adminRoutes } from "./admin";
export { authRoutes } from "./auth";
export { clientRoutes } from "./client";
export * from "./web";
export { WEB_SEO_ROUTE } from "./webSeo";
export { adminNavigation, clientNavigation, hotuxNavigation } from "./navigation";
export { isRouteActive } from "./match";
export type { NavItem } from "./types";

import { adminRoutes } from "./admin";
import { authRoutes } from "./auth";
import { clientRoutes } from "./client";

/** Backward-compatible facade for feature code. New code can import a domain route group. */
export const routes = {
  home: clientRoutes.home,
  homePage: clientRoutes.homePage,
  rooms: clientRoutes.rooms,
  bookings: clientRoutes.bookings,
  reservation: clientRoutes.reservation,
  account: clientRoutes.account,
  about: clientRoutes.pages.about,
  blog: clientRoutes.pages.blog,
  contact: clientRoutes.pages.contact,
  ui: clientRoutes.pages.ui,
  pages: clientRoutes.pages,
  auth: authRoutes,
  admin: adminRoutes,
} as const;
