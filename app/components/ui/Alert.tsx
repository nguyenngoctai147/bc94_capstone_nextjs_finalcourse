import type { ReactNode } from "react";
export function Alert({ children, variant = "info" }: { children: ReactNode; variant?: "info" | "success" | "warning" | "danger" }) {
  return <div className={`alert alert-${variant}`} role={variant === "danger" ? "alert" : "status"}>{children}</div>;
}
