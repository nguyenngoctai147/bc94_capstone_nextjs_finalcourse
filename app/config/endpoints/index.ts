import { authEndpoints } from "./auth";
import { resourceEndpoints } from "./resources";

export { authEndpoints } from "./auth";
export * from "./apiNotToken";
export { bookingEndpoints } from "./bookings";
export * from "./core.api";
export { locationEndpoints } from "./locations";
export * from "./next.api";
export { reviewEndpoints } from "./reviews";
export { resourceEndpoints } from "./resources";
export { roomEndpoints } from "./rooms";
export { userEndpoints } from "./users";

/** Backward-compatible endpoint facade used by feature services. */
export const endpoints = {
  auth: authEndpoints,
  ...resourceEndpoints,
} as const;

export const byId = (path: string, id: number | string) => `${path}/${encodeURIComponent(id)}`;
