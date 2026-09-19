import { api } from "./http";
import { toPage } from "./response";
import { unsupportedMethod } from "./errors";
import type { Page, RequestOptions } from "./types";

export function createCrudService<T extends { id: number }, Create, Update = Create>(
  path: string, capabilities: { detail?: boolean; patch?: boolean; deleteByQuery?: boolean } = {},
) {
  return {
    list: async (options?: RequestOptions) => toPage(await api.get<T[] | Page<T>>(path, options)),
    detail: (id: number, options?: RequestOptions): Promise<T> => {
      if (capabilities.detail === false) unsupportedMethod("GET /{id}");
      return api.get<T>(`${path}/${id}`, options);
    },
    create: (data: Create, options?: RequestOptions) => api.post<T>(path, data, options),
    update: (id: number, data: Update, options?: RequestOptions) => api.put<T>(`${path}/${id}`, data, options),
    patch: (id: number, data: Partial<Update>, options?: RequestOptions): Promise<T> => {
      if (!capabilities.patch) unsupportedMethod("PATCH");
      return api.patch<T>(`${path}/${id}`, data, options);
    },
    remove: async (id: number, options?: RequestOptions) => {
      await api.delete(capabilities.deleteByQuery ? path : `${path}/${id}`,
        capabilities.deleteByQuery ? { ...options, params: { ...options?.params, id } } : options);
      return id;
    },
  };
}
