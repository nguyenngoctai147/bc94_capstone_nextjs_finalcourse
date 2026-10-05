import type { CSSProperties, HTMLAttributes } from "react";

type LayoutProps = HTMLAttributes<HTMLDivElement>;
type Space = 1 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12 | 16 | 20;

export function Container({ width = "content", className = "", ...props }: LayoutProps & {
  width?: "content" | "wide" | "reading" | "form";
}) {
  return <div {...props} className={`ds-container ds-container--${width} ${className}`} />;
}

function layoutStyle(gap: Space, style?: CSSProperties) {
  return { "--ds-layout-gap": `var(--ds-space-${gap})`, ...style } as CSSProperties;
}

export function Stack({ gap = 4, style, className = "", ...props }: LayoutProps & { gap?: Space }) {
  return <div {...props} style={layoutStyle(gap, style)} className={`ds-stack ${className}`} />;
}

export function Cluster({ gap = 4, style, className = "", ...props }: LayoutProps & { gap?: Space }) {
  return <div {...props} style={layoutStyle(gap, style)} className={`ds-cluster ${className}`} />;
}
