"use client";

import { useEffect, type ReactNode } from "react";
import { usePathname } from "next/navigation";

const stylesheets = [
  "/assets/css/default.css",
  "/assets/css/icons.css",
  "/assets/fonts/flaticon.css",
  "/assets/css/plugin.css",
  "/assets/css/style.css",
];

type BootstrapProvidersProps = Readonly<{
  children: ReactNode;
}>;

export default function BootstrapProviders({
  children,
}: BootstrapProvidersProps) {
  const pathname = usePathname();

  useEffect(() => {
    let active = true;
    const cleanups: Array<() => void> = [];

    const initializeBootstrap = async () => {
      const { Carousel, Tooltip } = await import(
        "bootstrap/dist/js/bootstrap.bundle.min.js"
      );

      if (!active) return;

      document
        .querySelectorAll<HTMLElement>('[data-bs-ride="carousel"]')
        .forEach((element) => {
          const carousel = Carousel.getOrCreateInstance(element);
          cleanups.push(() => carousel.dispose());
        });

      document
        .querySelectorAll<HTMLElement>('[data-bs-toggle="tooltip"]')
        .forEach((element) => {
          const tooltip = Tooltip.getOrCreateInstance(element);
          cleanups.push(() => tooltip.dispose());
        });
    };

    void initializeBootstrap();

    return () => {
      active = false;
      cleanups.forEach((cleanup) => cleanup());
    };
  }, [pathname]);

  return (
    <>
      {stylesheets.map((href) => (
        <link key={href} rel="stylesheet" href={href} precedence="hotux" />
      ))}
      {children}
    </>
  );
}
