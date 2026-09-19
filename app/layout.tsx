/* eslint-disable @next/next/no-css-tags -- legacy CSS intentionally lives in public/assets/css so its relative asset URLs stay valid. */
import type { Metadata } from "next";
import { StoreProvider } from "@/providers/StoreProvider";
import "bootstrap/dist/css/bootstrap.min.css";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "Stay • Đặt phòng & quản lý", template: "%s | Stay" },
  description: "Nền tảng đặt phòng và quản lý lưu trú.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="vi" data-scroll-behavior="smooth">
      <head>
        {/* Static Hotux theme files are served from public/assets/css. */}
        <link rel="stylesheet" href="/assets/css/default.css" />
        <link rel="stylesheet" href="/assets/css/icons.css" />
        <link rel="stylesheet" href="/assets/fonts/flaticon.css" />
        <link rel="stylesheet" href="/assets/css/plugin.css" />
        <link rel="stylesheet" href="/assets/css/style.css" />
      </head>
      <body>
        <StoreProvider>{children}</StoreProvider>
        <div id="back-to-top">
          <a href="#"></a>
        </div>
      </body>
    </html>
  );
}
