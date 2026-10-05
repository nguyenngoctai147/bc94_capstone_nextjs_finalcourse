import { routes } from "@/config/routes";
import type { IconName } from "./AdminIcon";

export type MenuItem = {
  label: string;
  icon: IconName;
  href?: string;
  submenuId?: string;
  children?: { label: string; href: string }[];
};

export const menuItems: MenuItem[] = [
  { label: "Dashboard", icon: "box", href: routes.admin.dashboard },
  { label: "Sliders Section", icon: "sliders", href: routes.admin.slider },
  {
    label: "Category Section",
    icon: "list",
    submenuId: "category",
    children: [
      { label: "Main Category", href: routes.admin.locations },
      { label: "Parent Category", href: routes.admin.locations },
      { label: "Child Category", href: routes.admin.locations },
    ],
  },
  { label: "About Section", icon: "file", href: routes.admin.dashboard },
  { label: "Content Management", icon: "type", href: routes.admin.dashboard },
  { label: "Sevices Section", icon: "columns", href: routes.admin.rooms },
  { label: "Gallery Section", icon: "image", href: routes.admin.dashboard },
  {
    label: "Package Management",
    icon: "user",
    submenuId: "events",
    children: [
      { label: "All Package Lists", href: routes.admin.rooms },
      { label: "Add Package", href: routes.admin.rooms },
    ],
  },
  { label: "Testimonial Section", icon: "gift", href: routes.admin.reviews },
  { label: "Booking Section", icon: "table", href: routes.admin.bookings },
  { label: "Coupons", icon: "gift", href: routes.admin.bookings },
  {
    label: "User Management",
    icon: "user",
    submenuId: "users",
    children: [
      { label: "All User Lists", href: routes.admin.users },
      { label: "Add User", href: routes.admin.users },
    ],
  },
  {
    label: "Settings",
    icon: "settings",
    submenuId: "setting",
    children: [
      { label: "Company Profile", href: routes.admin.companyProfile },
      { label: "Role Management", href: routes.admin.users },
      { label: "Configuration", href: routes.admin.dashboard },
    ],
  },
];

export function routeIsActive(pathname: string, href?: string) {
  if (!href) return false;
  return href === routes.admin.dashboard
    ? pathname === href
    : pathname.startsWith(href);
}
