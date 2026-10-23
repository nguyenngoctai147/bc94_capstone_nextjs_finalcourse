/* eslint-disable @next/next/no-css-tags -- legacy CSS intentionally lives in public/assets/css so its relative asset URLs stay valid. */
import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import { StoreProvider } from "@/providers/StoreProvider";
import "bootstrap/dist/css/bootstrap.min.css";
import "./globals.css";

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin", "vietnamese"],
  weight: ["300", "400", "500", "700", "900"],
  display: "swap",
});

export const metadata: Metadata = {
  title: { default: "Hotux • Đặt phòng & quản lý", template: "%s | Hotux" },
  description: "Nền tảng đặt phòng và quản lý lưu trú.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="vi" data-scroll-behavior="smooth" className={roboto.variable}>
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
      </body>
    </html>
  );
}
