import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    files: ["app/layout.tsx", "app/(admin)/admin/layout.tsx"],
    rules: {
      "@next/next/no-css-tags": "off",
    },
  },
  {
    files: ["app/features/home/components/HomeBanner.tsx"],
    rules: {
      "@next/next/no-img-element": "off",
    },
  },
  {
    files: [
      "app/features/reservations/components/BookingPage.tsx",
      "app/features/reservations/components/ConfirmationPage.tsx",
      "app/features/reservations/components/SelectRoomPage.tsx",
    ],
    rules: {
      "react-hooks/set-state-in-effect": "off",
    },
  },
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    "public/assets/legacy/**",
    "public/assets/dashboard/vendors/**",
  ]),
]);

export default eslintConfig;
