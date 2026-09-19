import { PageTemplate } from "@/templates/PageTemplate";

export default function Layout({ children }: { children: React.ReactNode }) {
  return <PageTemplate title="Blog" breadcrumb="Blog">{children}</PageTemplate>;
}
