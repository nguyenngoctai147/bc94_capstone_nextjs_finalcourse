import { roomEndpoints } from "@/config/endpoints";
import { createCrudService } from "@/lib/api/crud-service";
import { api } from "@/lib/api/http";
import { toPage } from "@/lib/api/response";
import type { Page, PageQuery, RequestOptions } from "@/lib/api/types";
import type { Room, CreateRoom, UpdateRoom } from "./rooms.types";
export const roomsService = {
  ...createCrudService<Room, CreateRoom, UpdateRoom>(roomEndpoints.base),

  list: async (options?: RequestOptions) => toPage(await api.get<Room[] | Page<Room>>(
    options?.params && Object.keys(options.params).length ? roomEndpoints.search : roomEndpoints.base, options)),
  search: (params: PageQuery, options?: RequestOptions) => api.get<Page<Room>>(roomEndpoints.search, { ...options, params }),

  byLocation: (maViTri: number, options?: RequestOptions) => api.get<Room[]>(roomEndpoints.byLocation, { ...options, params: { maViTri } }),
  uploadImage: (id: number, file: File, options?: RequestOptions) => {
    const data = new FormData(); data.append("formFile", file);
    return api.post<unknown>(roomEndpoints.uploadImage, data, { ...options, params: { maPhong: id } });
  },
};
