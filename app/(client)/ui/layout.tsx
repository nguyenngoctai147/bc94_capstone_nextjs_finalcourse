import { PageTemplate } from "@/templates/PageTemplate";

export default function Layout({ children }: { children: React.ReactNode }) {
  return <PageTemplate title="Design System" breadcrumb="Design System">{children}</PageTemplate>;
}
