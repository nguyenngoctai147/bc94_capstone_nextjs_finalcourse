const base = "/phong-thue";

export const roomEndpoints = {
  base,
  detail: (id: number | string) => `${base}/${encodeURIComponent(id)}`,
  search: `${base}/phan-trang-tim-kiem`,
  byLocation: `${base}/lay-phong-theo-vi-tri`,
  uploadImage: `${base}/upload-hinh-phong`,
} as const;
