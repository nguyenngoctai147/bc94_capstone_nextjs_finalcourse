import { PageTemplate } from "@/templates/PageTemplate";

export default function Layout({ children }: { children: React.ReactNode }) {
  return <PageTemplate title="Quên mật khẩu" content="bare">{children}</PageTemplate>;
}
