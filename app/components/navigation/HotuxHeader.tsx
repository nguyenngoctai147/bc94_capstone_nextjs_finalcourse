"use client";

import Link from "next/link";
import Image from "next/image";
import logo from "../../../public/assets/images/logo.png";
import darkLogo from "../../../public/assets/images/logo-black.png";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  authRoutes,
  clientRoutes,
  hotuxNavigation,
  isRouteActive,
  type NavItem,
} from "@/config/routes";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { logout } from "@/features/auth/auth.slice";
import { useClientReady } from "@/hooks/useClientReady";
import type { User } from "@/features/users/users.types";
import { siteInfo } from "@/config/site";

const Icon = ({ name }: { name: string }) => (
  <i className={`fa ${name}`} aria-hidden="true" />
);

function AuthenticatedAccountMenu({ user }: { user: User }) {
  const dispatch = useAppDispatch();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLLIElement>(null);

  useEffect(() => {
    const closeOnOutsideInteraction = (event: MouseEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", closeOnOutsideInteraction);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("mousedown", closeOnOutsideInteraction);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, []);

  return (
    <li className="account-context" ref={menuRef}>
      <button
        type="button"
        className="account-context-trigger"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
      >
        <Icon name="fa-user" /> {user.name} <Icon name="fa-angle-down" />
      </button>
      {open && (
        <ul className="account-context-menu" role="menu" aria-label="Tài khoản">
          <li role="none"><Link href={clientRoutes.account} role="menuitem" onClick={() => setOpen(false)}><Icon name="fa-user" /> Tài khoản</Link></li>
          <li role="none"><Link href={clientRoutes.bookings} role="menuitem" onClick={() => setOpen(false)}><Icon name="fa-calendar" /> Đặt phòng của tôi</Link></li>
          <li className="account-context-separator" role="separator" />
          <li role="none">
            <button type="button" role="menuitem" onClick={() => dispatch(logout())}>
              <Icon name="fa-sign-out" /> Đăng xuất
            </button>
          </li>
        </ul>
      )}
    </li>
  );
}

export function HotuxHeader() {
  const pathname = usePathname();
  const { user: storedUser, hydrated } = useAppSelector((state) => state.auth);
  const clientReady = useClientReady();
  const user = clientReady && hydrated ? storedUser : null;
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const toggleMenu = (label: string) =>
    setOpenMenu((current) => (current === label ? null : label));

  return (
    <header className="main_header_area">
      <div className="header-content">
        <div className="container">
          <div className="links links-left">
            <ul>
              <li>
                <a href={`mailto:${siteInfo.email}`}>
                  <Icon name="fa-envelope" /> {siteInfo.email}
                </a>
              </li>
              <li>
                <a href={`tel:${siteInfo.phone}`}>
                  <Icon name="fa-phone" /> {siteInfo.phoneLabel}
                </a>
              </li>
            </ul>
          </div>
          <div className="links links-right pull-right">
            <ul>
              {user ? (
                <AuthenticatedAccountMenu user={user} />
              ) : (
                <li><Link href={authRoutes.login}><Icon name="fa-user" /> Đăng nhập</Link></li>
              )}
              {!user && (
                <li>
                  <Link href={authRoutes.register}>
                    <Icon name="fa-pencil" /> Đăng ký
                  </Link>
                </li>
              )}
              <li>
                <ul className="social-links">
                  <li>
                    <a
                      href="https://facebook.com"
                      target="_blank"
                      rel="noreferrer"
                      aria-label="Facebook"
                    >
                      <Icon name="fa-facebook" />
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://twitter.com"
                      target="_blank"
                      rel="noreferrer"
                      aria-label="Twitter"
                    >
                      <Icon name="fa-twitter" />
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://instagram.com"
                      target="_blank"
                      rel="noreferrer"
                      aria-label="Instagram"
                    >
                      <Icon name="fa-instagram" />
                    </a>
                  </li>
                </ul>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className={`header_menu ${mobileOpen ? "menu-open" : ""}`}>
        <div className="container">
          <nav className="navbar navbar-default" aria-label="Điều hướng chính">
            <div className="navbar-header">
              <Link
                className="navbar-brand"
                href={clientRoutes.home}
                onClick={() => setMobileOpen(false)}
              >
                <Image
                  src={logo}
                  alt="Hotux"
                  className="logo-white"
                />
                <Image
                  src={darkLogo}
                  alt=""
                  className="logo-black"
                />
              </Link>
              <button type="button" className="site-menu-toggle" aria-controls="hotux-navigation"
                aria-expanded={mobileOpen} aria-label={mobileOpen ? "Đóng menu" : "Mở menu"}
                onClick={() => setMobileOpen((value) => !value)}>
                <Icon name={mobileOpen ? "fa-times" : "fa-bars"} />
              </button>
            </div>
            <div
              id="hotux-navigation"
              className={`collapse navbar-collapse ${mobileOpen ? "show" : ""}`}
            >
              <ul className="nav navbar-nav" id="responsive-menu">
                {hotuxNavigation.map((item: NavItem) => {
                  const active = isRouteActive(pathname, item);
                  return (
                    <li
                      className={`submenu ${item.children ? "dropdown" : ""} ${active ? "active" : ""}`}
                      key={item.label}
                    >
                      {item.children ? (
                        <a
                          href={item.href}
                          aria-current={active ? "page" : undefined}
                          className="dropdown-toggle"
                          aria-haspopup="true"
                          aria-expanded={openMenu === item.label}
                          onClick={(event) => {
                            event.preventDefault();
                            toggleMenu(item.label);
                          }}
                        >
                          {item.label}
                          <i className="fa fa-angle-down" aria-hidden="true" />
                        </a>
                      ) : (
                        <Link
                          href={item.href}
                          onClick={() => setMobileOpen(false)}
                        >
                          {item.label}
                        </Link>
                      )}
                      {item.children && (
                        <ul
                          className={`dropdown-menu ${openMenu === item.label ? "show" : ""}`}
                        >
                          {item.children.map((child) => (
                            <li key={child.href}>
                              <Link
                                href={child.href}
                                onClick={() => {
                                  setMobileOpen(false);
                                  setOpenMenu(null);
                                }}
                              >
                                {child.label}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      )}
                    </li>
                  );
                })}
              </ul>
              <div className="nav-btn">
                <Link href={clientRoutes.reservation.availability} className="btn btn-orange">
                  Đặt phòng
                </Link>
              </div>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}
