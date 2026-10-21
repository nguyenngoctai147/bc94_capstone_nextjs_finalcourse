import axios from "axios";
import { NEXT_BACKEND_PROXY_ENDPOINT } from "@/config/endpoints";
import { toApiError } from "@/lib/api/errors";
import { unwrapResponse } from "@/lib/api/response";
import type { ApiEnvelope, RequestOptions } from "@/lib/api/types";

// Một Axios instance dùng chung, tương tự services/api.js của bài React.
// Trình duyệt gọi proxy Next.js; tokenCybersoft chỉ được thêm ở server.
export const http = axios.create({
  baseURL: NEXT_BACKEND_PROXY_ENDPOINT,
  timeout: 20000,
});

http.interceptors.response.use(
  (response) => response,
  (error: unknown) => Promise.reject(toApiError(error)),
);

async function request<T>(
  method: string,
  url: string,
  data: unknown,
  options: RequestOptions = {},
): Promise<T> {
  const response = await http.request<T | ApiEnvelope<T>>({
    method,
    url,
    data,
    signal: options.signal,
    params: options.params,
    // Thunk truyền token hiện tại vào từng request, không đọc localStorage khi import file.
    headers: options.token ? { token: options.token } : undefined,
  });

  return unwrapResponse(response.data);
}

export const api = {
  get: <T>(url: string, options?: RequestOptions) =>
    request<T>("GET", url, undefined, options),
  post: <T>(url: string, data?: unknown, options?: RequestOptions) =>
    request<T>("POST", url, data, options),
  put: <T>(url: string, data: unknown, options?: RequestOptions) =>
    request<T>("PUT", url, data, options),
  patch: <T>(url: string, data: unknown, options?: RequestOptions) =>
    request<T>("PATCH", url, data, options),
  delete: <T = void>(url: string, options?: RequestOptions) =>
    request<T>("DELETE", url, undefined, options),
};
