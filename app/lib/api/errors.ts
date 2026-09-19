import axios from "axios";
import type { ApiError } from "./types";

export function toApiError(error: unknown): ApiError {
  if (axios.isAxiosError(error)) {
    const body = error.response?.data;
    return {
      status: error.response?.status ?? 0,
      message: typeof body?.content === "string" ? body.content
        : typeof body?.message === "string" ? body.message
        : error.code === "ECONNABORTED" ? "Yêu cầu quá thời gian chờ. Vui lòng thử lại."
        : error.response ? "Backend trả về lỗi. Vui lòng thử lại." : "Không thể kết nối API.",
    };
  }
  if (typeof error === "object" && error !== null && "message" in error && "status" in error
      && typeof error.message === "string" && typeof error.status === "number") {
    return { message: error.message, status: error.status };
  }
  return { status: 0, message: error instanceof Error ? error.message : "Đã có lỗi xảy ra." };
}
export const unsupportedMethod = (method: string): never => {
  throw { status: 405, message: `Swagger hiện chưa hỗ trợ ${method} cho tài nguyên này.` } satisfies ApiError;
};
