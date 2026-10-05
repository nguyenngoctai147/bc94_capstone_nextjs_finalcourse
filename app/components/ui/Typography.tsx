import type { HTMLAttributes } from "react";

type TextElement = "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span" | "div";
type TextVariant = "h1" | "h2" | "h3" | "h4" | "lead" | "body" | "label" | "caption" | "eyebrow";

export function Typography({
  as: Element = "p", variant = "body", tone = "default", align = "start", className = "", ...props
}: HTMLAttributes<HTMLElement> & {
  as?: TextElement;
  variant?: TextVariant;
  tone?: "default" | "muted" | "brand";
  align?: "start" | "center" | "end";
}) {
  return <Element {...props} className={`ds-type ds-type--${variant} ds-tone--${tone} ds-align--${align} ${className}`} />;
}
