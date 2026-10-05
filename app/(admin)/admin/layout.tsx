import { AdminTemplate } from "@/templates/AdminTemplate";
import { AdminVendorScripts } from "@/components/admin/AdminVendorScripts";
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* Dashboard pages intentionally use the original Hotux template assets. */}
      <link rel="stylesheet" href="/assets/dashboard/vendors/core/core.css" />
      <link rel="stylesheet" href="/assets/dashboard/fonts/feather-font/css/iconfont.css" />
      <link rel="stylesheet" href="/assets/dashboard/css/style.css" />
      <AdminVendorScripts />
      <AdminTemplate>{children}</AdminTemplate>
    </>
  );
}
