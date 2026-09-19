import axios from "axios";
import { NEXT_BACKEND_PROXY_ENDPOINT } from "@/config/endpoints";
import { toApiError } from "./errors";
import { unwrapResponse } from "./response";
import type { ApiEnvelope, RequestOptions } from "./types";

export const http = axios.create({ baseURL: NEXT_BACKEND_PROXY_ENDPOINT, timeout: 20000 });
http.interceptors.response.use((response) => response, (error: unknown) => Promise.reject(toApiError(error)));

async function request<T>(method: string, url: string, data: unknown, options: RequestOptions = {}): Promise<T> {
  const response = await http.request<T | ApiEnvelope<T>>({
    method, url, data, signal: options.signal, params: options.params,
    headers: options.token ? { token: options.token } : undefined,
  });
  return unwrapResponse(response.data);
}
export const api = {
  get: <T>(url: string, options?: RequestOptions) => request<T>("GET", url, undefined, options),
  post: <T>(url: string, data?: unknown, options?: RequestOptions) => request<T>("POST", url, data, options),
  put: <T>(url: string, data: unknown, options?: RequestOptions) => request<T>("PUT", url, data, options),
  patch: <T>(url: string, data: unknown, options?: RequestOptions) => request<T>("PATCH", url, data, options),
  delete: <T = void>(url: string, options?: RequestOptions) => request<T>("DELETE", url, undefined, options),
};
