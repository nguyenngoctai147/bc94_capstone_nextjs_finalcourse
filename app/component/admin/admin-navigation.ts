import { adminNavigation, isRouteActive, routes } from "@/config/routes";
import type { IconName } from "./AdminIcon";

export type MenuItem = {
  label: string;
  icon: IconName;
  href?: string;
  submenuId?: string;
  children?: { label: string; href: string }[];
};

const icons: Record<string, IconName> = {
  [routes.admin.dashboard]: "box",
  [routes.admin.rooms]: "columns",
  [routes.admin.bookings]: "calendar",
  [routes.admin.locations]: "image",
  [routes.admin.users]: "users",
  [routes.admin.reviews]: "star",
};

export const menuItems: MenuItem[] = adminNavigation.map(({ label, href }) => ({
  label, href, icon: icons[href] ?? "box",
}));

export function routeIsActive(pathname: string, href?: string) {
  if (!href) return false;
  return isRouteActive(pathname, { href, label: "", exact: href === routes.admin.dashboard });
}
