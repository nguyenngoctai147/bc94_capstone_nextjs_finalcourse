const base = "/binh-luan";

export const reviewEndpoints = {
  base,
  detail: (id: number | string) => `${base}/${encodeURIComponent(id)}`,
  byRoom: (id: number | string) => `${base}/lay-binh-luan-theo-phong/${encodeURIComponent(id)}`,
} as const;
