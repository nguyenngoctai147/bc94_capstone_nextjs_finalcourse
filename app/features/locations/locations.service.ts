import { nextApi } from "@/route/next.api";
import { createCrudService } from "@/services/crud";
import { api } from "@/services/http";
import { toPage } from "@/services/api-utils";
import type { Page, PageQuery, RequestOptions } from "@/types/api";
import type {
  Location,
  CreateLocation,
  UpdateLocation,
} from "@/store/type/location";
export const locationsService = {
  ...createCrudService<Location, CreateLocation, UpdateLocation>(
    nextApi.location.base,
  ),

  list: async (options?: RequestOptions) =>
    toPage(
      await api.get<Location[] | Page<Location>>(
        options?.params && Object.keys(options.params).length
          ? nextApi.location.search
          : nextApi.location.base,
        options,
      ),
    ),
  search: (params: PageQuery, options?: RequestOptions) =>
    api.get<Page<Location>>(nextApi.location.search, { ...options, params }),

  uploadImage: (id: number, file: File, options?: RequestOptions) => {
    const data = new FormData();
    data.append("formFile", file);
    return api.post<unknown>(nextApi.location.uploadImage, data, {
      ...options,
      params: { maViTri: id },
    });
  },
};
