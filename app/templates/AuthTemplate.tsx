import Link from "next/link";
import type { ReactNode } from "react";
import { routes } from "@/config/routes";
export function AuthTemplate({ children }: { children: ReactNode }) {
  return <main className="auth-shell"><div className="auth-panel">
    <Link href={routes.home} className="brand d-inline-block mb-4">stay.</Link>
    <div className="card shadow-sm"><div className="card-body p-4 p-md-5">{children}</div></div>
    <Link className="d-inline-block mt-4 text-muted" href={routes.home}>← Về trang chủ</Link>
  </div></main>;
}
