import { PageTemplate } from "@/templates/PageTemplate";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <PageTemplate title="Liên hệ" content="bare">
      {children}
    </PageTemplate>
  );
}
