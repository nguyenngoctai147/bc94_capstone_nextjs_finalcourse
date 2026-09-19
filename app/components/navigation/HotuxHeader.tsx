"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  authRoutes,
  clientRoutes,
  hotuxNavigation,
  isRouteActive,
  type NavItem,
} from "@/config/routes";
import { useAppSelector } from "@/store/hooks";

const Icon = ({ name }: { name: string }) => (
  <i className={`fa ${name}`} aria-hidden="true" />
);

export function HotuxHeader() {
  const pathname = usePathname();
  const user = useAppSelector((state) => state.auth.user);
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
                <a href="mailto:info@hotux.com.np">
                  <Icon name="fa-envelope" /> info@hotux.com.np
                </a>
              </li>
              <li>
                <a href="tel:+977222333444">
                  <Icon name="fa-phone" /> 977-222-333-444
                </a>
              </li>
              <li>
                <label className="visually-hidden" htmlFor="hotux-language">
                  Ngôn ngữ
                </label>
                <select id="hotux-language" className="wide" defaultValue="Eng">
                  <option>Eng</option>
                  <option>Fra</option>
                  <option>Esp</option>
                </select>
              </li>
            </ul>
          </div>
          <div className="links links-right pull-right">
            <ul>
              <li>
                <Link href={user ? clientRoutes.account : authRoutes.login}>
                  <Icon name="fa-user" /> {user ? user.name : "Login"}
                </Link>
              </li>
              {!user && (
                <li>
                  <Link href={authRoutes.register}>
                    <Icon name="fa-pencil" /> Register
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
                  <li>
                    <a
                      href="https://plus.google.com"
                      target="_blank"
                      rel="noreferrer"
                      aria-label="Google Plus"
                    >
                      <Icon name="fa-google-plus" />
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
                <img
                  src="/assets/images/logo.png"
                  alt="Hotux"
                  className="logo-white"
                />
                <img
                  src="/assets/images/logo-black.png"
                  alt="Hotux"
                  className="logo-black"
                />
              </Link>
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
                  Book Now
                </Link>
              </div>
            </div>
            <div id="slicknav-mobile" />
          </nav>
        </div>
      </div>
    </header>
  );
}
