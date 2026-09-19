import { PageTemplate } from "@/templates/PageTemplate";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <PageTemplate title="About Us" breadcrumb="About Us">
      {children}
    </PageTemplate>
  );
}
