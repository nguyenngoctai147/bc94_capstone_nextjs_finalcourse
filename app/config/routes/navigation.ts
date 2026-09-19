import { adminRoutes } from "./admin";
import { clientRoutes } from "./client";
import type { NavItem } from "./types";

export const clientNavigation: readonly NavItem[] = [
  { label: "Khám phá", href: clientRoutes.home, exact: true },
  { label: "Phòng lưu trú", href: clientRoutes.rooms.list },
  { label: "Đặt phòng của tôi", href: clientRoutes.bookings },
];

export const adminNavigation: readonly NavItem[] = [
  { label: "Tổng quan", href: adminRoutes.dashboard, exact: true },
  { label: "Phòng", href: adminRoutes.rooms },
  { label: "Đặt phòng", href: adminRoutes.bookings },
  { label: "Vị trí", href: adminRoutes.locations },
  { label: "Người dùng", href: adminRoutes.users },
  { label: "Đánh giá", href: adminRoutes.reviews },
];

/** Public menu for the Hotux header. Keep this list flat and focused on the main site pages. */
export const hotuxNavigation: readonly NavItem[] = [
  { label: "Trang chủ", href: clientRoutes.home, exact: true, aliases: [clientRoutes.homePage] },
  { label: "Về chúng tôi", href: clientRoutes.pages.about },
  { label: "Đặt phòng", href: clientRoutes.reservation.availability },
  { label: "Gallery", href: `${clientRoutes.home}#gallery` },
  { label: "Blog", href: clientRoutes.pages.blog },
  { label: "Liên hệ", href: clientRoutes.pages.contact },
];
