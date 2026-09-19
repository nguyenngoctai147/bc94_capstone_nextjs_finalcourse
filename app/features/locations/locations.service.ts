import { locationEndpoints } from "@/config/endpoints";
import { createCrudService } from "@/lib/api/crud-service";
import { api } from "@/lib/api/http";
import { toPage } from "@/lib/api/response";
import type { Page, PageQuery, RequestOptions } from "@/lib/api/types";
import type { Location, CreateLocation, UpdateLocation } from "./locations.types";
export const locationsService = {
  ...createCrudService<Location, CreateLocation, UpdateLocation>(locationEndpoints.base),

  list: async (options?: RequestOptions) => toPage(await api.get<Location[] | Page<Location>>(
    options?.params && Object.keys(options.params).length ? locationEndpoints.search : locationEndpoints.base, options)),
  search: (params: PageQuery, options?: RequestOptions) => api.get<Page<Location>>(locationEndpoints.search, { ...options, params }),

  uploadImage: (id: number, file: File, options?: RequestOptions) => {
    const data = new FormData(); data.append("formFile", file);
    return api.post<unknown>(locationEndpoints.uploadImage, data, { ...options, params: { maViTri: id } });
  },
};
