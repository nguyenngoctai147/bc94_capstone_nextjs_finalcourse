"use client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import type { ReactNode } from "react";
import { useAppSelector } from "@/store/hooks";
import { routes } from "@/route";
import { useClientReady } from "@/hooks/useClientReady";
import { getLoginHref, isAdminRole } from "@/features/auth/auth-navigation";
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
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isReady = clientReady && hydrated;
  const hasSession = Boolean(user && token);
  const hasRequiredRole = !role || (role === "ADMIN" && isAdminRole(user?.role));

  useEffect(() => {
    if (!isReady) return;
    if (!hasSession) {
      const query = searchParams.toString();
      router.replace(getLoginHref(`${pathname}${query ? `?${query}` : ""}`));
      return;
    }
    if (!hasRequiredRole) router.replace(routes.reservation.availability);
  }, [hasRequiredRole, hasSession, isReady, pathname, router, searchParams]);

  if (!isReady || !hasSession || !hasRequiredRole)
    return <div className="auth-pending" role="status">Đang chuyển đến trang phù hợp…</div>;
  return children;
}
