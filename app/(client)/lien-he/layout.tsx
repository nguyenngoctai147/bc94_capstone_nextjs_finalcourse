import { PageTemplate } from "@/templates/PageTemplate";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <PageTemplate title="Contact Us" breadcrumb="Contact Us">
      {children}
    </PageTemplate>
  );
}
