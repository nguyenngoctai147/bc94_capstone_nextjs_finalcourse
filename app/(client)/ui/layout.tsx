import { PageTemplate } from "@/templates/PageTemplate";

export default function Layout({ children }: { children: React.ReactNode }) {
  return <PageTemplate title="Components" breadcrumb="Components">{children}</PageTemplate>;
}
