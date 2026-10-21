import type { ReactNode } from "react";

export function AdminContent({ children }: { children: ReactNode }) {
  return <main className="page-content" id="admin-main-content">{children}</main>;
}
