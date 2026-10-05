"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { routes } from "@/config/routes";
import { useAppSelector } from "@/store/hooks";
import { useClientReady } from "@/hooks/useClientReady";
import { Icon } from "./AdminIcon";

export function AdminHeader({ onMenu }: { onMenu: () => void }) {
  const { user: storedUser, hydrated } = useAppSelector((state) => state.auth);
  const clientReady = useClientReady();
  const user = clientReady && hydrated ? storedUser : null;
  const [dropdown, setDropdown] = useState<"notification" | "profile" | null>(
    null,
  );
  const toggle = (value: "notification" | "profile") =>
    setDropdown((current) => (current === value ? null : value));

  return (
    <nav className="navbar">
      <button
        className="sidebar-toggler"
        type="button"
        aria-label="Open sidebar"
        onClick={onMenu}
      >
        <Icon name="menu" />
      </button>
      <div className="navbar-content">
        <form
          className="search-form w-25"
          onSubmit={(event) => event.preventDefault()}
        >
          <div className="input-group">
            <div className="input-group-text">
              <Icon name="search" />
            </div>
            <input
              type="text"
              className="form-control"
              id="navbarForm"
              placeholder="Search here..."
            />
          </div>
        </form>
        <ul className="navbar-nav">
          <li className="nav-item dropdown">
            <button
              className="nav-link dropdown-toggle"
              type="button"
              id="notificationDropdown"
              aria-haspopup="true"
              aria-expanded={dropdown === "notification"}
              onClick={() => toggle("notification")}
            >
              <Icon name="bell" />
              <div className="indicator">
                <div className="circle" />
              </div>
            </button>
            <div
              className={`dropdown-menu p-0 ${dropdown === "notification" ? "show" : ""}`}
              aria-labelledby="notificationDropdown"
            >
              <div className="px-3 py-2 d-flex align-items-center justify-content-between border-bottom">
                <p>6 New Notifications</p>
                <button
                  className="text-muted border-0 bg-transparent"
                  type="button"
                >
                  Clear all
                </button>
              </div>
              <div className="p-1">
                <button
                  className="dropdown-item d-flex align-items-center py-2"
                  type="button"
                >
                  <div className="wd-30 ht-30 d-flex align-items-center justify-content-center bg-primary rounded-circle me-3">
                    <Icon className="icon-sm text-white" name="gift" />
                  </div>
                  <div className="flex-grow-1 me-2">
                    <p>New Order Recieved</p>
                    <p className="tx-12 text-muted">30 min ago</p>
                  </div>
                </button>
                <button
                  className="dropdown-item d-flex align-items-center py-2"
                  type="button"
                >
                  <div className="wd-30 ht-30 d-flex align-items-center justify-content-center bg-primary rounded-circle me-3">
                    <Icon className="icon-sm text-white" name="alert-circle" />
                  </div>
                  <div className="flex-grow-1 me-2">
                    <p>Server Limit Reached!</p>
                    <p className="tx-12 text-muted">1 hrs ago</p>
                  </div>
                </button>
              </div>
              <div className="px-3 py-2 d-flex align-items-center justify-content-center border-top">
                <button
                  className="border-0 bg-transparent text-primary"
                  type="button"
                >
                  View all
                </button>
              </div>
            </div>
          </li>
          <li className="nav-item dropdown">
            <button
              className="nav-link dropdown-toggle"
              type="button"
              id="profileDropdown"
              aria-haspopup="true"
              aria-expanded={dropdown === "profile"}
              onClick={() => toggle("profile")}
            >
              <Image
                className="wd-30 ht-30 rounded-circle"
                src={user?.avatar || "/assets/images/review1.jpg"}
                alt="profile"
                width={30}
                height={30}
              />
            </button>
            <div
              className={`dropdown-menu p-0 ${dropdown === "profile" ? "show" : ""}`}
              aria-labelledby="profileDropdown"
            >
              <div className="d-flex flex-column align-items-center border-bottom px-5 py-3">
                <div className="mb-3">
                  <Image
                    className="wd-80 ht-80 rounded-circle"
                    src={user?.avatar || "/assets/images/review1.jpg"}
                    alt=""
                    width={80}
                    height={80}
                  />
                </div>
                <div className="text-center">
                  <p className="tx-16 fw-bolder">{user?.name || "Administrator"}</p>
                  <p className="tx-12 text-muted">{user?.email || "admin@hotux.com"}</p>
                </div>
              </div>
              <ul className="list-unstyled p-1">
                <li className="dropdown-item py-2">
                  <Link href={routes.admin.companyProfile} className="text-body ms-0">
                    <Icon className="me-2 icon-md" name="user" />
                    <span>Profile</span>
                  </Link>
                </li>
                <li className="dropdown-item py-2">
                  <Link href={routes.admin.companyProfile} className="text-body ms-0">
                    <Icon className="me-2 icon-md" name="edit" />
                    <span>Edit Profile</span>
                  </Link>
                </li>
                <li className="dropdown-item py-2">
                  <Link
                    href={routes.admin.dashboard}
                    className="text-body ms-0"
                  >
                    <Icon className="me-2 icon-md" name="users" />
                    <span>Switch User</span>
                  </Link>
                </li>
                <li className="dropdown-item py-2">
                  <Link href={routes.home} className="text-body ms-0">
                    <Icon className="me-2 icon-md" name="log-out" />
                    <span>Log Out</span>
                  </Link>
                </li>
              </ul>
            </div>
          </li>
        </ul>
      </div>
    </nav>
  );
}
