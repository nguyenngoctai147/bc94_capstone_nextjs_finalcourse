"use client";
import Link from "next/link";
import type { ReactNode } from "react";
import { useAppSelector } from "@/store/hooks";
import { routes } from "@/config/routes";
import { EmptyState } from "@/components/ui";
export function RequireAuth({ children, role }: { children: ReactNode; role?: "ADMIN" }) {
  const { user, token } = useAppSelector((state) => state.auth);
  if (!user || !token) return <EmptyState title="Vui lòng đăng nhập" description="Đăng nhập để tiếp tục vào khu vực này." action={<Link className="btn btn-primary" href={routes.auth.login}>Đăng nhập</Link>} />;
  if (role && user.role !== role) return <EmptyState title="Bạn không có quyền truy cập" description="Khu vực này dành cho quản trị viên." />;
  return children;
}
