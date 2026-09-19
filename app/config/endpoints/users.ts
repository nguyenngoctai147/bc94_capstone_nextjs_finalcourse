const base = "/users";

export const userEndpoints = {
  base,
  detail: (id: number | string) => `${base}/${encodeURIComponent(id)}`,
  search: `${base}/phan-trang-tim-kiem`,
  byName: (name: string) => `${base}/search/${encodeURIComponent(name)}`,
  uploadAvatar: `${base}/upload-avatar`,
} as const;
