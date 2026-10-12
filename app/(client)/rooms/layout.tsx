import { PageTemplate } from "@/templates/PageTemplate";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <PageTemplate title="Danh sách phòng" breadcrumb="Danh sách phòng" content="bare">
      {children}
    </PageTemplate>
  );
}
