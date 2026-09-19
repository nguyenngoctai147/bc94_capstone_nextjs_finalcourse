import { ClientTemplate } from "@/templates/ClientTemplate";

export default function Layout({ children }: { children: React.ReactNode }) {
  return <ClientTemplate>{children}</ClientTemplate>;
}
