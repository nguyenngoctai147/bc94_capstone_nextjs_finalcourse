import { PageTemplate } from "@/templates/PageTemplate";

export default function ReservationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PageTemplate title="Đặt phòng" content="bare">
      {children}
    </PageTemplate>
  );
}
