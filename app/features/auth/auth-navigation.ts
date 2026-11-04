import { routes } from "@/route";

export const getSafeReturnPath = (value: string | null, fallback: string) =>
  value?.startsWith("/") && !value.startsWith("//") ? value : fallback;

export const getLoginHref = (returnPath: string) =>
  `${routes.auth.login}?next=${encodeURIComponent(returnPath)}`;

export const isAdminRole = (role: string | null | undefined) =>
  role?.trim().toUpperCase() === "ADMIN";

const isAdminPath = (value: string) =>
  value === routes.admin.dashboard ||
  value.startsWith(`${routes.admin.dashboard}/`) ||
  value.startsWith(`${routes.admin.dashboard}?`);

export const getPostLoginPath = (
  role: string | null | undefined,
  returnPath: string | null,
) => {
  if (isAdminRole(role)) return routes.admin.dashboard;

  const safePath = getSafeReturnPath(returnPath, routes.home);
  return isAdminPath(safePath) ? routes.home : safePath;
};
