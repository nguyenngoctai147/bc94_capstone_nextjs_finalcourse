import type { ApiEnvelope, Page } from "./types";
export function unwrapResponse<T>(body: T | ApiEnvelope<T>): T {
  if (body && typeof body === "object" && "content" in body && "statusCode" in body) {
    const envelope = body as ApiEnvelope<T>;
    if (envelope.statusCode >= 400) throw { status: envelope.statusCode, message: typeof envelope.content === "string" ? envelope.content : envelope.message ?? "Yêu cầu không thành công." };
    return envelope.content;
  }
  return body as T;
}
export function toPage<T>(value: T[] | Page<T>): Page<T> {
  if (Array.isArray(value)) return { data: value, totalRow: value.length, pageIndex: 1, pageSize: value.length };
  if (value && Array.isArray(value.data)) return value;
  throw { status: 502, message: "Dữ liệu danh sách không đúng định dạng. Kiểm tra response Swagger." };
}
