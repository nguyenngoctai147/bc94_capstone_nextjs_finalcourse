const base = "/vi-tri";

export const locationEndpoints = {
  base,
  detail: (id: number | string) => `${base}/${encodeURIComponent(id)}`,
  search: `${base}/phan-trang-tim-kiem`,
  uploadImage: `${base}/upload-hinh-vitri`,
} as const;
