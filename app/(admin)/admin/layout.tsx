/* eslint-disable @next/next/no-css-tags -- Hotux dashboard CSS is served from public so its relative font URLs remain intact. */
import { AdminTemplate } from "@/templates/AdminTemplate";
import { RequireAuth } from "@/components/auth/RequireAuth";
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* Dashboard pages intentionally use the original Hotux template assets. */}
      <link rel="stylesheet" href="/assets/dashboard/vendors/core/core.css" />
      <link rel="stylesheet" href="/assets/dashboard/fonts/feather-font/css/iconfont.css" />
      <link rel="stylesheet" href="/assets/dashboard/css/style.css" />
      <RequireAuth role="ADMIN">
        <AdminTemplate>{children}</AdminTemplate>
      </RequireAuth>
    </>
  );
}
