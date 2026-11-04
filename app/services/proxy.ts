import axios from "axios";
import api from "@/services/api";
import { BackendApiConfigError } from "@/services/api-utils";

const rules: [RegExp, readonly string[]][] = [
  [/^auth\/(signin|signup)$/, ["POST"]],
  [/^(phong-thue|vi-tri|dat-phong|binh-luan)$/, ["GET", "POST"]],
  [/^users$/, ["GET", "POST", "DELETE"]],
  [/^(phong-thue|vi-tri|dat-phong)\/\d+$/, ["GET", "PUT", "DELETE"]],
  [/^users\/\d+$/, ["GET", "PUT"]],
  [/^binh-luan\/\d+$/, ["PUT", "DELETE"]],
  [/^(phong-thue|vi-tri|users)\/phan-trang-tim-kiem$/, ["GET"]],
  [/^phong-thue\/lay-phong-theo-vi-tri$/, ["GET"]],
  [/^dat-phong\/lay-theo-nguoi-dung\/\d+$/, ["GET"]],
  [/^binh-luan\/lay-binh-luan-theo-phong\/\d+$/, ["GET"]],
  [/^users\/search\/[^/]+$/, ["GET"]],
  [
    /^(phong-thue\/upload-hinh-phong|vi-tri\/upload-hinh-vitri|users\/upload-avatar)$/,
    ["POST"],
  ],
];

export const checkBackendPath = (segments: string[], method: string): number => {
  if (
    segments.some(
      (segment) =>
        !segment ||
        segment === "." ||
        segment === ".." ||
        /[\\/%?#\u0000-\u001f]/.test(segment),
    )
  ) return 400;

  const rule = rules.find(([pattern]) => pattern.test(segments.join("/")));
  return !rule ? 404 : rule[1].includes(method) ? 200 : 405;
};

const jsonError = (message: string, status: number) =>
  Response.json({ message }, { status });

const readBody = async (request: Request) => {
  if (request.method === "GET") return undefined;
  const body = await request.arrayBuffer();
  return body.byteLength ? Buffer.from(body) : undefined;
};

const createHeaders = (request: Request) => {
  const headers: Record<string, string> = {};
  const token = request.headers.get("token");
  const contentType = request.headers.get("content-type");
  if (token) headers.token = token;
  if (contentType) headers["Content-Type"] = contentType;
  return headers;
};

export const proxyBackend = async (
  request: Request,
  segments: string[],
): Promise<Response> => {
  const status = checkBackendPath(segments, request.method);
  if (status !== 200) {
    return jsonError(
      status === 405
        ? "Swagger hiện chưa hỗ trợ method này."
        : "Đường dẫn API không hợp lệ.",
      status,
    );
  }

  const url = new URL(request.url);
  const origin = request.headers.get("origin");
  if (request.method !== "GET" && origin && origin !== url.origin) {
    return jsonError("Origin không được phép.", 403);
  }

  try {
    const response = await api.request<ArrayBuffer>({
      method: request.method,
      url: segments.map(encodeURIComponent).join("/"),
      data: await readBody(request),
      headers: createHeaders(request),
      params: url.searchParams,
      signal: request.signal,
    });

    if (response.status >= 300 && response.status < 400) {
      return jsonError("Backend trả về redirect không được hỗ trợ.", 502);
    }

    return new Response(
      response.status === 204 ? null : new Uint8Array(response.data),
      {
        status: response.status,
        headers: {
          "Content-Type": String(
            response.headers["content-type"] || "application/json",
          ),
          "Cache-Control": "no-store",
          "X-Content-Type-Options": "nosniff",
        },
      },
    );
  } catch (error) {
    if (error instanceof BackendApiConfigError) {
      return jsonError(error.message, 503);
    }
    return jsonError(
      axios.isAxiosError(error) && error.code === "ECONNABORTED"
        ? "Backend quá thời gian chờ."
        : "Không thể kết nối backend hoặc cấu hình URL chưa hợp lệ.",
      502,
    );
  }
};
