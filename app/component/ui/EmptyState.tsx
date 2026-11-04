import type { ReactNode } from "react";
export function EmptyState({
  title = "Chưa có dữ liệu",
  description,
  action,
}: {
  title?: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="border rounded-4 bg-white text-center p-5">
      <h2 className="h5">{title}</h2>
      {description && <p className="text-muted">{description}</p>}
      {action}
    </div>
  );
}
