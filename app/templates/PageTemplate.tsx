import type { ReactNode } from "react";
import Link from "next/link";
import { HotuxFooter, HotuxHeader } from "@/components/navigation";
import { routes } from "@/config/routes";

type PageTemplateProps = {
  children: ReactNode;
  title?: string;
  breadcrumb?: string;
  content?: "contained" | "bare";
};

export function PageTemplate({
  children,
  title = "Reservation",
  breadcrumb = title,
  content = "contained",
}: PageTemplateProps) {
  return (
    <>
      <HotuxHeader />
      <section className="breadcrumb-outer">
        <div className="container">
          <div className="breadcrumb-content">
            <h2>{title}</h2>
            <nav aria-label="breadcrumb">
              <ul className="breadcrumb">
                <li className="breadcrumb-item">
                  <Link href={routes.home}>Home</Link>
                </li>
                <li className="breadcrumb-item active" aria-current="page">
                  {breadcrumb}
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </section>
      {content === "contained" ? (
        <section className="content">
          <div className="container">{children}</div>
        </section>
      ) : children}
      <HotuxFooter />
      <div id="back-to-top">
        <a href="#"></a>
      </div>
    </>
  );
}
