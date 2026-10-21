import { PageTemplate } from "@/templates/PageTemplate";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <PageTemplate title="Cẩm nang lưu trú" content="bare">
      {children}
    </PageTemplate>
  );
}
