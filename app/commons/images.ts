const API_IMAGE_ORIGIN = "https://airbnbnew.cybersoft.edu.vn";

export const resolveApiImageSrc = (
  value: string | null | undefined,
): string | null => {
  const source = value?.trim();
  if (!source) return null;

  if (/^\/assets\/images\/[\w./()-]+$/i.test(source) && !source.includes("..")) {
    return source;
  }

  const absolute =
    source.startsWith("/images/") || source.startsWith("/avatar/")
      ? `${API_IMAGE_ORIGIN}${source}`
      : source;

  try {
    const url = new URL(absolute);
    if (url.protocol !== "https:" || url.username || url.password || url.port) {
      return null;
    }
    if (
      url.hostname === "airbnbnew.cybersoft.edu.vn" &&
      (url.pathname.startsWith("/images/") || url.pathname.startsWith("/avatar/")) &&
      !url.search
    ) return url.href;
    if (url.hostname === "encrypted-tbn0.gstatic.com" && url.pathname === "/images") {
      return url.href;
    }
    if (url.hostname === "acihome.vn" && url.pathname.startsWith("/uploads/") && !url.search) {
      return url.href;
    }
  } catch {
    return null;
  }

  return null;
};
