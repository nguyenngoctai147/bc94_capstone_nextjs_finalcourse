"use client";
import Link from "next/link";
import type { ReactNode } from "react";
import { useAppSelector } from "@/store/hooks";
import { routes } from "@/config/routes";
import { EmptyState } from "@/components/ui";
import { useClientReady } from "@/hooks/useClientReady";
export function RequireAuth({
  children,
  role,
}: {
  children: ReactNode;
  role?: "ADMIN";
}) {
  const { user, token, hydrated } = useAppSelector((state) => state.auth);
  const clientReady = useClientReady();
  if (!clientReady || !hydrated) return <div className="auth-pending" role="status">Đang khôi phục phiên đăng nhập…</div>;
  if (!user || !token)
    return (
      <EmptyState
        title="Vui lòng đăng nhập"
        description="Đăng nhập để tiếp tục vào khu vực này."
        action={
          <Link className="btn btn-primary" href={routes.auth.login}>
            Đăng nhập
          </Link>
        }
      />
    );
  if (role && user.role !== role)
    return (
      <EmptyState
        title="Bạn không có quyền truy cập"
        description="Khu vực này dành cho quản trị viên."
      />
    );
  return children;
}
