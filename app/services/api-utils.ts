import axios from "axios";
import type { ApiEnvelope, ApiError, Page } from "@/types/api";

export class BackendApiConfigError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "BackendApiConfigError";
  }
}

export const getBackendConfig = () => {
  const baseUrl = process.env.API_BASE_URL;
  const tokenCybersoft = process.env.CYBERSOFT_TOKEN;
  const timeout = Number(process.env.API_TIMEOUT_MS || 15000);

  if (!baseUrl || !tokenCybersoft) {
    throw new BackendApiConfigError(
      "Chưa cấu hình API_BASE_URL hoặc CYBERSOFT_TOKEN trong .env.local.",
    );
  }

  let url: URL;
  try {
    url = new URL(baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`);
  } catch {
    throw new BackendApiConfigError("API_BASE_URL không hợp lệ.");
  }

  if (
    !["https:", "http:"].includes(url.protocol) ||
    url.search ||
    url.hash ||
    url.username ||
    url.password ||
    !Number.isFinite(timeout) ||
    timeout <= 0
  ) {
    throw new BackendApiConfigError("Cấu hình backend không hợp lệ.");
  }

  return { baseURL: url.toString(), tokenCybersoft, timeout };
};

export const toApiError = (error: unknown): ApiError => {
  if (axios.isAxiosError(error)) {
    const body = error.response?.data;
    return {
      status: error.response?.status ?? 0,
      message:
        typeof body?.content === "string"
          ? body.content
          : typeof body?.message === "string"
            ? body.message
            : error.code === "ECONNABORTED"
              ? "Yêu cầu quá thời gian chờ. Vui lòng thử lại."
              : error.response
                ? "Backend trả về lỗi. Vui lòng thử lại."
                : "Không thể kết nối API.",
    };
  }

  if (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    "status" in error &&
    typeof error.message === "string" &&
    typeof error.status === "number"
  ) {
    return { message: error.message, status: error.status };
  }

  return {
    status: 0,
    message: error instanceof Error ? error.message : "Đã có lỗi xảy ra.",
  };
};

export const unsupportedMethod = (method: string): never => {
  throw {
    status: 405,
    message: `Swagger hiện chưa hỗ trợ ${method} cho tài nguyên này.`,
  } satisfies ApiError;
};

export const unwrapResponse = <T>(body: T | ApiEnvelope<T>): T => {
  if (body && typeof body === "object" && "content" in body && "statusCode" in body) {
    const envelope = body as ApiEnvelope<T>;
    if (envelope.statusCode >= 400) {
      throw {
        status: envelope.statusCode,
        message:
          typeof envelope.content === "string"
            ? envelope.content
            : (envelope.message ?? "Yêu cầu không thành công."),
      } satisfies ApiError;
    }
    return envelope.content;
  }

  return body as T;
};

export const toPage = <T>(value: T[] | Page<T>): Page<T> => {
  if (Array.isArray(value)) {
    return { data: value, totalRow: value.length, pageIndex: 1, pageSize: value.length };
  }
  if (value && Array.isArray(value.data)) return value;

  throw {
    status: 502,
    message: "Dữ liệu danh sách không đúng định dạng. Kiểm tra response Swagger.",
  } satisfies ApiError;
};
