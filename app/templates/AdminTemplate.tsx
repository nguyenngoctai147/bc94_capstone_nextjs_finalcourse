"use client";

import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import {
  AdminContent,
  AdminFooter,
  AdminHeader,
  AdminSidebar,
} from "@/components/admin";

export function AdminTemplate({ children }: { children: ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [folded, setFolded] = useState(false);

  useEffect(() => {
    document.body.classList.toggle("sidebar-open", mobileOpen);
    document.body.classList.toggle("sidebar-folded", folded);
    return () => {
      document.body.classList.remove("sidebar-open", "sidebar-folded");
    };
  }, [mobileOpen, folded]);

  return (
    <div className="main-wrapper">
      <AdminSidebar
        onClose={() => setMobileOpen(false)}
        folded={folded}
        onFold={() => setFolded((value) => !value)}
      />
      <div className="page-wrapper">
        <AdminHeader onMenu={() => setMobileOpen((value) => !value)} />
        <AdminContent>{children}</AdminContent>
        <AdminFooter />
      </div>
    </div>
  );
}
