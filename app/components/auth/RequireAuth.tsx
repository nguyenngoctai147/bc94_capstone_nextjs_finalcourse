"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import type { ReactNode } from "react";
import { useAppSelector } from "@/store/hooks";
import { routes } from "@/config/routes";
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
  const router = useRouter();
  const isReady = clientReady && hydrated;
  const hasSession = Boolean(user && token);
  const hasRequiredRole = !role || user?.role.trim().toUpperCase() === role;

  useEffect(() => {
    if (!isReady) return;
    if (!hasSession) {
      router.replace(routes.auth.login);
      return;
    }
    if (!hasRequiredRole) router.replace(routes.reservation.availability);
  }, [hasRequiredRole, hasSession, isReady, router]);

  if (!isReady || !hasSession || !hasRequiredRole)
    return <div className="auth-pending" role="status">Đang chuyển đến trang phù hợp…</div>;
  return children;
}
