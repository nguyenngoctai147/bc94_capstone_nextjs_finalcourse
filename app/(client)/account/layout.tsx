import { PageTemplate } from "@/templates/PageTemplate";

export default function Layout({ children }: { children: React.ReactNode }) {
  return <PageTemplate title="Account" breadcrumb="Account">{children}</PageTemplate>;
}
