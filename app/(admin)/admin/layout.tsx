import { AdminTemplate } from "@/templates/AdminTemplate";
import { RequireAuth } from "@/component/auth/RequireAuth";
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <link rel="stylesheet" href="/assets/dashboard/vendors/core/core.css" />
      <link rel="stylesheet" href="/assets/dashboard/fonts/feather-font/css/iconfont.css" />
      <link rel="stylesheet" href="/assets/dashboard/css/style.css" />
      <RequireAuth role="ADMIN">
        <AdminTemplate>{children}</AdminTemplate>
      </RequireAuth>
    </>
  );
}
