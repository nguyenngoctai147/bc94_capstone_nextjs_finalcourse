import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import AppProviders from "@/provider/AppProviders";
import "bootstrap/dist/css/bootstrap.min.css";
import "./theme/base/globals.css";

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

export default function RootLayout({ children, modal }: LayoutProps<"/">) {
  return (
    <html lang="vi" data-scroll-behavior="smooth" className={roboto.variable}>
      <body suppressHydrationWarning>
        <AppProviders>
          {children}
          {modal}
        </AppProviders>
      </body>
    </html>
  );
}
