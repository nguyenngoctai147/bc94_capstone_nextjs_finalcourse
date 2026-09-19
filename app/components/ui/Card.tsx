import type { HTMLAttributes, ReactNode } from "react";
export function Card({
  title,
  children,
  footer,
  className = "",
  ...props
}: Omit<HTMLAttributes<HTMLDivElement>, "title"> & {
  title?: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <div {...props} className={`card h-100 ${className}`}>
      <div className="card-body p-4">
        {title && <h2 className="h5 card-title mb-3">{title}</h2>}
        {children}
      </div>
      {footer && (
        <div className="card-footer bg-transparent border-top p-3">
          {footer}
        </div>
      )}
    </div>
  );
}
