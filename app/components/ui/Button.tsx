import type { ButtonHTMLAttributes } from "react";
import { LoadingSpinner } from "./LoadingSpinner";
type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?:
    | "primary"
    | "secondary"
    | "success"
    | "danger"
    | "warning"
    | "light"
    | "dark"
    | "outline-primary"
    | "outline-secondary";
  size?: "sm" | "lg";
  loading?: boolean;
};
export function Button({
  children,
  variant = "primary",
  size,
  loading = false,
  disabled,
  className = "",
  type = "button",
  ...props
}: Props) {
  return (
    <button
      {...props}
      type={type}
      disabled={disabled || loading}
      aria-busy={loading}
      className={`btn btn-${variant} ${size ? `btn-${size}` : ""} ${className}`}
    >
      {loading && (
        <span className="me-2">
          <LoadingSpinner small />
        </span>
      )}
      {children}
    </button>
  );
}
