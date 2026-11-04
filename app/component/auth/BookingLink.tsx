"use client";

import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { getLoginHref } from "@/features/auth/auth-navigation";
import { useClientReady } from "@/hooks/useClientReady";
import { useAppSelector } from "@/store/hooks";

type BookingLinkProps = Omit<ComponentProps<typeof Link>, "href" | "children"> & {
  href: string;
  children?: ReactNode;
};

export const getBookingLinkHref = (href: string, hasSession: boolean) =>
  hasSession ? href : getLoginHref(href);

export function BookingLink({ href, children, ...props }: BookingLinkProps) {
  const { user, token, hydrated } = useAppSelector((state) => state.auth);
  const clientReady = useClientReady();
  const hasSession = clientReady && hydrated && Boolean(user && token);

  return (
    <Link href={getBookingLinkHref(href, hasSession)} {...props}>
      {children}
    </Link>
  );
}
