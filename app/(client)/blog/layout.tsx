import { HotuxFooter, HotuxHeader } from "@/components/navigation";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="ds-site">
      <HotuxHeader />
      {children}
      <HotuxFooter />
      <div id="back-to-top"><a href="#" /></div>
    </div>
  );
}
