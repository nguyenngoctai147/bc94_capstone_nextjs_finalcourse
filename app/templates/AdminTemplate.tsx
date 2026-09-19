import Link from "next/link";
import type { ReactNode } from "react";
import { routes, adminNavigation } from "@/config/routes";
import { NavLinks } from "@/components/navigation/NavLinks";
import { AccountMenu } from "@/components/navigation/AccountMenu";
export function AdminTemplate({ children }: { children: ReactNode }) {
  return (
    <>
      <header className="site-header">
        <div className="container-fluid px-4 py-3 d-flex gap-3 flex-wrap justify-content-between align-items-center">
          <Link href={routes.admin.dashboard} className="brand">
            stay. <span className="fs-6 text-muted">quản trị</span>
          </Link>
          <div className="d-flex gap-3 align-items-center">
            <Link href={routes.home}>Xem website</Link>
            <AccountMenu />
          </div>
        </div>
      </header>
      <div className="container-fluid p-4">
        <div className="row g-4">
          <aside className="col-lg-3 col-xl-2">
            <nav className="admin-sidebar p-3" aria-label="Quản trị">
              <NavLinks items={adminNavigation} vertical />
            </nav>
          </aside>
          <main className="col-lg-9 col-xl-10">{children}</main>
        </div>
      </div>
    </>
  );
}
