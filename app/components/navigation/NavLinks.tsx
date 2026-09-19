"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { isRouteActive, type NavItem } from "@/config/routes";
export function NavLinks({
  items,
  vertical = false,
}: {
  items: readonly NavItem[];
  vertical?: boolean;
}) {
  const pathname = usePathname();
  return (
    <ul className={`nav gap-1 ${vertical ? "flex-column" : ""}`}>
      {items.map((item) => {
        const active = isRouteActive(pathname, item);
        return (
          <li className="nav-item" key={item.href}>
            <Link
              className={`nav-link ${active ? "active" : ""}`}
              href={item.href}
              aria-current={active ? "page" : undefined}
            >
              {item.label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
