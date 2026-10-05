import type { ReactNode } from "react";
import { HotuxFooter, HotuxHeader } from "@/components/navigation";
export function ClientTemplate({ children }: { children: ReactNode }) {
  return (
    <div className="ds-site">
      <HotuxHeader />
      <main id="main-content" className="site-main">
        {children}
      </main>
      <HotuxFooter />
    </div>
  );
}
