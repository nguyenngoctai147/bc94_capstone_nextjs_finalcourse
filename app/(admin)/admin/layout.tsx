/* eslint-disable @next/next/no-page-custom-font, @next/next/no-css-tags -- Hotux dashboard CSS is served from public so its relative font URLs remain intact. */
import { AdminTemplate } from "@/templates/AdminTemplate";
import { RequireAuth } from "@/components/auth/RequireAuth";
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* Dashboard pages intentionally use the original Hotux template assets. */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700;900&display=swap"
      />
      <link rel="stylesheet" href="/assets/dashboard/vendors/core/core.css" />
      <link rel="stylesheet" href="/assets/dashboard/fonts/feather-font/css/iconfont.css" />
      <link rel="stylesheet" href="/assets/dashboard/css/style.css" />
      <RequireAuth role="ADMIN">
        <AdminTemplate>{children}</AdminTemplate>
      </RequireAuth>
    </>
  );
}
