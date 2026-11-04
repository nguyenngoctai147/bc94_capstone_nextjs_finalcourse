import { nextApi } from "@/route/next.api";
import { createCrudService } from "@/services/crud";
import { api } from "@/services/http";
import { toPage } from "@/services/api-utils";
import type { Page, PageQuery, RequestOptions } from "@/types/api";
import type { Room, CreateRoom, UpdateRoom } from "@/store/type/room";
export const roomsService = {
  ...createCrudService<Room, CreateRoom, UpdateRoom>(nextApi.room.base),

  list: async (options?: RequestOptions) => toPage(await api.get<Room[] | Page<Room>>(
    options?.params && Object.keys(options.params).length ? nextApi.room.search : nextApi.room.base, options)),
  search: (params: PageQuery, options?: RequestOptions) => api.get<Page<Room>>(nextApi.room.search, { ...options, params }),

  byLocation: async (maViTri: number, options?: RequestOptions) => {
    const rooms = await api.get<Room[]>(nextApi.room.byLocation, {
      ...options,
      params: { maViTri },
    });
    if (!Array.isArray(rooms))
      throw { status: 502, message: "Danh sách phòng theo vị trí không đúng định dạng." };
    return rooms;
  },
  uploadImage: (id: number, file: File, options?: RequestOptions) => {
    const data = new FormData(); data.append("formFile", file);
    return api.post<unknown>(nextApi.room.uploadImage, data, { ...options, params: { maPhong: id } });
  },
};
