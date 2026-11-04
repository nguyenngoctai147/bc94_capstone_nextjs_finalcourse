"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { routes } from "@/route";
import { ApiImage } from "@/component/ui/ApiImage";
import { logout } from "@/store/slice/auth";
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
        <ul className="navbar-nav">
          <li className="nav-item dropdown" ref={menuRef}>
            <button className="nav-link dropdown-toggle" type="button" id="profileDropdown"
              aria-label="Menu tài khoản quản trị" aria-controls="admin-account-menu" aria-expanded={open} onClick={() => setOpen((value) => !value)}>
              <ApiImage className="wd-30 ht-30 rounded-circle object-fit-cover" src={user?.avatar} alt="" width={30} height={30}
                fallback={<Icon name="user" />} />
            </button>
            {open && <div id="admin-account-menu" className="dropdown-menu show p-0 admin-account-menu" aria-labelledby="profileDropdown">
              <div className="d-flex flex-column align-items-center border-bottom px-5 py-3">
                <div className="mb-3">
                  <ApiImage className="wd-80 ht-80 rounded-circle object-fit-cover" src={user?.avatar} alt="" width={80} height={80}
                    fallback={<span className="wd-80 ht-80 rounded-circle d-inline-flex align-items-center justify-content-center bg-light text-muted"><Icon name="user" size={32} /></span>} />
                </div>
                <div className="text-center">
                  <p className="tx-16 fw-bolder">{user?.name ?? "Quản trị viên"}</p>
                  <p className="tx-12 text-muted">{user?.email ?? ""}</p>
                </div>
              </div>
              <ul className="admin-account-actions list-unstyled p-1">
                <li className="dropdown-item py-2"><Link href={routes.admin.profile} className="text-body ms-0" onClick={() => setOpen(false)}><Icon className="me-2 icon-md" name="user" />Profile</Link></li>
                <li className="dropdown-item py-2"><Link href={routes.admin.profile} className="text-body ms-0" onClick={() => setOpen(false)}><Icon className="me-2 icon-md" name="edit" />Edit Profile</Link></li>
                <li className="dropdown-item py-2"><Link href={routes.admin.users} className="text-body ms-0" onClick={() => setOpen(false)}><Icon className="me-2 icon-md" name="repeat" />Switch User</Link></li>
                <li className="dropdown-item py-2"><button type="button" className="text-body ms-0 border-0 bg-transparent p-0" onClick={() => {
                  dispatch(logout()); setOpen(false); router.replace(routes.auth.login);
                }}><Icon className="me-2 icon-md" name="log-out" />Sign Out</button></li>
              </ul>
            </div>}
          </li>
        </ul>
      </div>
    </nav>
  );
}
