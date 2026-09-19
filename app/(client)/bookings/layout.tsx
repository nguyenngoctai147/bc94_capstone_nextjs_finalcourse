import { PageTemplate } from "@/templates/PageTemplate";

export default function Layout({ children }: { children: React.ReactNode }) {
  return <PageTemplate title="Bookings" breadcrumb="Bookings">{children}</PageTemplate>;
}
