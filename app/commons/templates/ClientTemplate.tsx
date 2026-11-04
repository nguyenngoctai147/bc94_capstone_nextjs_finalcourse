import type { ReactNode } from "react";
import { HotuxFooter, HotuxHeader } from "@/components/navigation";
export function ClientTemplate({ children }: { children: ReactNode }) {
  return (
    <div className="ds-site" id="site-top">
      <a className="skip-link btn btn-orange" href="#main-content">
        Đến nội dung chính
      </a>
      <HotuxHeader />
      <main id="main-content" className="site-main" tabIndex={-1}>
        {children}
      </main>
      <HotuxFooter />
      <a
        className="site-back-to-top"
        href="#site-top"
        aria-label="Về đầu trang"
      >
        <i className="fa fa-angle-up" aria-hidden="true" />
      </a>
    </div>
  );
}
