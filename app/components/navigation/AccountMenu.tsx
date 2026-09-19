"use client";
import Link from "next/link";
import { routes } from "@/config/routes";
import { logout } from "@/features/auth/auth.slice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { Button } from "@/components/ui";
export function AccountMenu() {
  const user = useAppSelector((state) => state.auth.user);
  const dispatch = useAppDispatch();
  return (
    <div className="d-flex align-items-center gap-2">
      {user ? (
        <>
          <Link href={routes.account} className="btn btn-light btn-sm">
            {user.name}
          </Link>
          <Button
            size="sm"
            variant="outline-secondary"
            onClick={() => dispatch(logout())}
          >
            Đăng xuất
          </Button>
        </>
      ) : (
        <Link
          href={routes.auth.login}
          className="btn btn-outline-secondary btn-sm"
        >
          Đăng nhập
        </Link>
      )}
    </div>
  );
}
