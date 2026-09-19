"use client";
import { Card } from "@/components/ui";
import { useAppSelector } from "@/store/hooks";
export function AccountProfile() {
  const user = useAppSelector((state) => state.auth.user);
  if (!user) return null;
  return <Card title={user.name}><dl className="mb-0"><dt>Email</dt><dd>{user.email}</dd><dt>Điện thoại</dt><dd>{user.phone || "Chưa cập nhật"}</dd><dt>Vai trò</dt><dd>{user.role}</dd></dl></Card>;
}
