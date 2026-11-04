import type { NavItem } from "./types";

function matchesPath(pathname: string, item: NavItem) {
  const paths = [item.href, ...(item.aliases ?? [])];
  return paths.some((path) => item.exact
    ? pathname === path
    : pathname === path || pathname.startsWith(`${path}/`));
}

export function isRouteActive(pathname: string, item: NavItem): boolean {
  return matchesPath(pathname, item) || Boolean(item.children?.some((child) => isRouteActive(pathname, child)));
}
