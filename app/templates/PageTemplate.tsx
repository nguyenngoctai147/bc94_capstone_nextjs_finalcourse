import type { ReactNode } from "react";
import Link from "next/link";
import { ClientTemplate } from "./ClientTemplate";
import { routes } from "@/config/routes";

type PageTemplateProps = {
  children: ReactNode;
  title: string;
  breadcrumb?: string;
  content?: "contained" | "bare";
};

export function PageTemplate({
  children,
  title,
  breadcrumb = title,
  content = "contained",
}: PageTemplateProps) {
  return (
    <ClientTemplate>
      <section className="breadcrumb-outer">
        <div className="container">
          <div className="breadcrumb-content">
            <h1>{title}</h1>
            <nav aria-label="Đường dẫn trang">
              <ul className="breadcrumb">
                <li className="breadcrumb-item">
                  <Link href={routes.home}>Trang chủ</Link>
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
        <section className="content ds-content">
          <div className="container">{children}</div>
        </section>
      ) : children}
    </ClientTemplate>
  );
}
