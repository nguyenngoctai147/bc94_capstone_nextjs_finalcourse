export const NEXT_BACKEND_PROXY_ENDPOINT = "/api/backend";

export const nextBackendPath = (endpoint: string) => {
  const normalized = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  return `${NEXT_BACKEND_PROXY_ENDPOINT}${normalized}`;
};
