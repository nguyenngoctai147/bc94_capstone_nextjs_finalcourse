import { ClientTemplate } from "@/templates/ClientTemplate";
import { HomePage as HomeContent } from "@/features/home/components/HomePage";

export default function HomePage() {
  return (
    <ClientTemplate>
      <HomeContent />
    </ClientTemplate>
  );
}
