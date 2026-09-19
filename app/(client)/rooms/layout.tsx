import { PageTemplate } from "@/templates/PageTemplate";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <PageTemplate title="Rooms" breadcrumb="Rooms" content="bare">
      {children}
    </PageTemplate>
  );
}
