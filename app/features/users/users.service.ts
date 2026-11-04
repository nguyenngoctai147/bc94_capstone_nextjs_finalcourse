import { nextApi } from "@/route/next.api";
import { createCrudService } from "@/services/crud";
import { api } from "@/services/http";
import { toPage } from "@/services/api-utils";
import type { Page, PageQuery, RequestOptions } from "@/types/api";
import type { User, CreateUser, UpdateUser } from "@/store/type/user";
export const usersService = {
  ...createCrudService<User, CreateUser, UpdateUser>(nextApi.user.base, { deleteByQuery: true }),

  list: async (options?: RequestOptions) => toPage(await api.get<User[] | Page<User>>(
    options?.params && Object.keys(options.params).length ? nextApi.user.search : nextApi.user.base, options)),
  search: (params: PageQuery, options?: RequestOptions) => api.get<Page<User>>(nextApi.user.search, { ...options, params }),

  byName: (name: string, options?: RequestOptions) => api.get<User[]>(nextApi.user.byName(name), options),
  uploadAvatar: (file: File, options?: RequestOptions) => {
    const data = new FormData(); data.append("formFile", file);
    return api.post<unknown>(nextApi.user.uploadAvatar, data, options);
  },
};
