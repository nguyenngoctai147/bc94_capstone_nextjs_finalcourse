import { AdminTemplate } from "@/templates/AdminTemplate";
import { AdminVendorScripts } from "@/components/admin/AdminVendorScripts";
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
      <AdminVendorScripts />
      <RequireAuth role="ADMIN">
        <AdminTemplate>{children}</AdminTemplate>
      </RequireAuth>
    </>
  );
}
