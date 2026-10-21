import Link from "next/link";
import type { ReactNode } from "react";

export type AdminBreadcrumb = {
  label: string;
  href?: string;
};

export function AdminPageHeader({
  title,
  description,
  breadcrumbs,
  action,
}: {
  title: string;
  description?: string;
  breadcrumbs: readonly AdminBreadcrumb[];
  action?: ReactNode;
}) {
  return (
    <>
      <nav
        className="page-breadcrumb d-flex align-items-center justify-content-between gap-3"
        aria-label="Breadcrumb"
      >
        <ol className="breadcrumb mb-0">
          {breadcrumbs.map((item, index) => {
            const current = index === breadcrumbs.length - 1;
            return (
              <li
                className={`breadcrumb-item ${current ? "active" : ""}`}
                aria-current={current ? "page" : undefined}
                key={`${item.label}-${index}`}
              >
                {!current && item.href ? (
                  <Link href={item.href}>{item.label}</Link>
                ) : (
                  item.label
                )}
              </li>
            );
          })}
        </ol>
        {action}
      </nav>
      <div className="mb-4">
        <h1 className="h3 mb-1">{title}</h1>
        {description && <p className="text-muted mb-0">{description}</p>}
      </div>
    </>
  );
}
