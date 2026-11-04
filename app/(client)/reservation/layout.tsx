import { PageTemplate } from "@/templates/PageTemplate";
import { RequireAuth } from "@/component/auth/RequireAuth";

export default function ReservationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PageTemplate title="Đặt phòng" content="bare">
      <RequireAuth>{children}</RequireAuth>
    </PageTemplate>
  );
}
