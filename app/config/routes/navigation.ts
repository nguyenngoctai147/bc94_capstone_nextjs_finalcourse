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
  { label: "Quản lý phòng", href: adminRoutes.rooms },
  { label: "Quản lý đặt phòng", href: adminRoutes.bookings },
  { label: "Quản lý vị trí", href: adminRoutes.locations },
  { label: "Quản lý người dùng", href: adminRoutes.users },
  { label: "Quản lý bình luận", href: adminRoutes.reviews },
];

export const hotuxNavigation: readonly NavItem[] = [
  { label: "Trang chủ", href: clientRoutes.home, exact: true, aliases: [clientRoutes.homePage] },
  { label: "Về chúng tôi", href: clientRoutes.pages.about },
  { label: "Chỗ nghỉ", href: clientRoutes.rooms.list },
  { label: "Đặt phòng", href: clientRoutes.reservation.availability },
  { label: "Thư viện ảnh", href: `${clientRoutes.home}#gallery` },
  { label: "Cẩm nang", href: clientRoutes.pages.blog },
  { label: "Liên hệ", href: clientRoutes.pages.contact },
];
