import { userEndpoints } from "@/config/endpoints";
import { createCrudService } from "@/lib/api/crud-service";
import { api } from "@/lib/api/http";
import { toPage } from "@/lib/api/response";
import type { Page, PageQuery, RequestOptions } from "@/lib/api/types";
import type { User, CreateUser, UpdateUser } from "./users.types";
export const usersService = {
  ...createCrudService<User, CreateUser, UpdateUser>(userEndpoints.base, { deleteByQuery: true }),

  list: async (options?: RequestOptions) => toPage(await api.get<User[] | Page<User>>(
    options?.params && Object.keys(options.params).length ? userEndpoints.search : userEndpoints.base, options)),
  search: (params: PageQuery, options?: RequestOptions) => api.get<Page<User>>(userEndpoints.search, { ...options, params }),

  byName: (name: string, options?: RequestOptions) => api.get<User[]>(userEndpoints.byName(name), options),
  uploadAvatar: (file: File, options?: RequestOptions) => {
    const data = new FormData(); data.append("formFile", file);
    return api.post<unknown>(userEndpoints.uploadAvatar, data, options);
  },
};
