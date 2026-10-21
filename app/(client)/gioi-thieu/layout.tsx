import { PageTemplate } from "@/templates/PageTemplate";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <PageTemplate title="Về chúng tôi" content="bare">
      {children}
    </PageTemplate>
  );
}
