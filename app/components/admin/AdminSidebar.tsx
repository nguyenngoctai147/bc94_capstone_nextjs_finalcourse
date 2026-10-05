"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { routes } from "@/config/routes";
import { Icon } from "./AdminIcon";
import { menuItems, routeIsActive } from "./admin-navigation";

export function AdminSidebar({
  onClose,
  folded,
  onFold,
}: {
  onClose: () => void;
  folded: boolean;
  onFold: () => void;
}) {
  const pathname = usePathname();
  const [openMenus, setOpenMenus] = useState<string[]>([]);
  const toggleMenu = (label: string) =>
    setOpenMenus((current) =>
      current.includes(label)
        ? current.filter((item) => item !== label)
        : [...current, label],
    );

  return (
    <nav className="sidebar">
      <div className="sidebar-header">
        <Link href={routes.home} className="sidebar-brand" onClick={onClose}>
          <Image
            src="/assets/images/logo-black.png"
            alt="logo"
            className="w-75"
            width={156}
            height={49}
            priority
          />
        </Link>
        <button
          className={`sidebar-toggler ${folded ? "active" : "not-active"}`}
          type="button"
          aria-label="Toggle sidebar"
          onClick={onFold}
        >
          <span />
          <span />
          <span />
        </button>
      </div>
      <div className="sidebar-body">
        <ul className="nav">
          {menuItems.map((item) => {
            const active =
              routeIsActive(pathname, item.href) ||
              item.children?.some((child) =>
                routeIsActive(pathname, child.href),
              );
            const expanded = openMenus.includes(item.label);
            const submenuId =
              item.submenuId ?? item.label.toLowerCase().replaceAll(" ", "-");
            return (
              <li
                className={`nav-item ${active ? "active" : ""}`}
                key={item.label}
              >
                {item.children ? (
                  <>
                    <a
                      className="nav-link"
                      href={`#${submenuId}`}
                      role="button"
                      aria-expanded={expanded}
                      aria-controls={submenuId}
                      onClick={(event) => {
                        event.preventDefault();
                        toggleMenu(item.label);
                      }}
                    >
                      <Icon className="link-icon" name={item.icon} />
                      <span className="link-title">{item.label}</span>
                      <Icon className="link-arrow" name="chevron-down" />
                    </a>
                    <div
                      className={`collapse ${expanded ? "show" : ""}`}
                      id={submenuId}
                    >
                      <ul className="nav sub-menu">
                        {item.children.map((child) => (
                          <li className="nav-item" key={child.label}>
                            <Link
                              href={child.href}
                              className={`nav-link ${routeIsActive(pathname, child.href) ? "active" : ""}`}
                              onClick={onClose}
                            >
                              {child.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </>
                ) : (
                  <Link
                    href={item.href ?? routes.admin.dashboard}
                    className="nav-link"
                    onClick={onClose}
                  >
                    <Icon className="link-icon" name={item.icon} />
                    <span className="link-title">{item.label}</span>
                  </Link>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
