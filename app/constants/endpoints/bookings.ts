const base = "/dat-phong";

export const bookingEndpoints = {
  base,
  detail: (id: number | string) => `${base}/${encodeURIComponent(id)}`,
  byUser: (id: number | string) => `${base}/lay-theo-nguoi-dung/${encodeURIComponent(id)}`,
} as const;
