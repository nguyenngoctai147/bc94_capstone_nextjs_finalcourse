import { PageTemplate } from "@/templates/PageTemplate";

export default function ReservationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PageTemplate title="Reservation" breadcrumb="Reservation">
      {children}
    </PageTemplate>
  );
}
