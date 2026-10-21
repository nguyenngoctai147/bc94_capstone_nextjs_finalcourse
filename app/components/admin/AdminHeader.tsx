"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { routes } from "@/config/routes";
import { ApiImage } from "@/components/ui/ApiImage";
import { logout } from "@/features/auth/auth.slice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { Icon } from "./AdminIcon";

export function AdminHeader({ onMenu }: { onMenu: () => void }) {
  const user = useAppSelector((state) => state.auth.user);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLLIElement>(null);

  useEffect(() => {
    const closeOutside = (event: MouseEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const closeOnEscape = (event: KeyboardEvent) => { if (event.key === "Escape") setOpen(false); };
    document.addEventListener("mousedown", closeOutside);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("mousedown", closeOutside);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, []);

  return (
    <nav className="navbar" aria-label="Điều hướng quản trị">
      <button className="sidebar-toggler" type="button" aria-label="Mở hoặc đóng thanh điều hướng" onClick={onMenu}><Icon name="menu" /></button>
      <div className="navbar-content">
        <Link href={routes.home} className="text-muted">Xem website</Link>
        <ul className="navbar-nav">
          <li className="nav-item dropdown" ref={menuRef}>
            <button className="nav-link dropdown-toggle" type="button" id="profileDropdown"
              aria-label="Menu tài khoản quản trị" aria-controls="admin-account-menu" aria-expanded={open} onClick={() => setOpen((value) => !value)}>
              <ApiImage className="wd-30 ht-30 rounded-circle object-fit-cover" src={user?.avatar} alt="" width={30} height={30}
                fallback={<Icon name="user" />} />
            </button>
            {open && <div id="admin-account-menu" className="dropdown-menu show p-0" aria-labelledby="profileDropdown">
              <div className="border-bottom px-3 py-3">
                <p className="fw-bold">{user?.name}</p><p className="text-muted">{user?.email}</p>
              </div>
              <ul className="list-unstyled p-1">
                <li><Link href={routes.admin.profile} className="dropdown-item py-2" onClick={() => setOpen(false)}><Icon className="me-2 icon-md" name="user" />Tài khoản</Link></li>
                <li><Link href={routes.admin.users} className="dropdown-item py-2" onClick={() => setOpen(false)}><Icon className="me-2 icon-md" name="users" />Quản lý người dùng</Link></li>
                <li><button type="button" className="dropdown-item py-2" onClick={() => {
                  dispatch(logout()); setOpen(false); router.replace(routes.auth.login);
                }}><Icon className="me-2 icon-md" name="log-out" />Đăng xuất</button></li>
              </ul>
            </div>}
          </li>
        </ul>
      </div>
    </nav>
  );
}
