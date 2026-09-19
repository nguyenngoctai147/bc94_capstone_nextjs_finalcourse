import axios from "axios";
import { checkBackendPath } from "./backend-policy";
const jsonError = (message: string, status: number) => Response.json({ message }, { status });

export async function proxyBackend(request: Request, segments: string[]): Promise<Response> {
  const policyStatus = checkBackendPath(segments, request.method);
  if (policyStatus !== 200) return jsonError(policyStatus === 405 ? "Swagger hiện chưa hỗ trợ method này." : "Đường dẫn API không hợp lệ.", policyStatus);
  const url = new URL(request.url);
  if (request.method !== "GET") {
    const origin = request.headers.get("origin");
    if (origin && origin !== url.origin) return jsonError("Origin không được phép.", 403);
  }
  const base = process.env.API_BASE_URL;
  const cybersoftToken = process.env.CYBERSOFT_TOKEN;
  if (!base || !cybersoftToken) return jsonError("Chưa cấu hình API_BASE_URL hoặc CYBERSOFT_TOKEN trong .env.local.", 503);
  const timeout = Number(process.env.API_TIMEOUT_MS || 15000);
  if (!Number.isFinite(timeout) || timeout <= 0) return jsonError("API_TIMEOUT_MS phải là số dương.", 503);
  try {
    const baseUrl = new URL(base.endsWith("/") ? base : `${base}/`);
    if (!["https:", "http:"].includes(baseUrl.protocol) || baseUrl.search || baseUrl.hash || baseUrl.username || baseUrl.password) return jsonError("API_BASE_URL không hợp lệ.", 503);
    const target = new URL(segments.map(encodeURIComponent).join("/"), baseUrl);
    target.search = url.search;
    const headers: Record<string, string> = { tokenCybersoft: cybersoftToken };
    const token = request.headers.get("token");
    if (token) headers.token = token;
    const contentType = request.headers.get("content-type");
    if (contentType) headers["Content-Type"] = contentType;
    const data = request.method === "GET" ? undefined : Buffer.from(await request.arrayBuffer());
    const response = await axios.request<ArrayBuffer>({
      url: target.toString(), method: request.method, headers, data, timeout,
      signal: request.signal, responseType: "arraybuffer", maxRedirects: 0,
      maxBodyLength: 10 * 1024 * 1024, maxContentLength: 20 * 1024 * 1024,
      validateStatus: () => true,
    });
    if (response.status >= 300 && response.status < 400) return jsonError("Backend trả về redirect không được hỗ trợ.", 502);
    return new Response(response.status === 204 ? null : new Uint8Array(response.data), {
      status: response.status,
      headers: { "Content-Type": String(response.headers["content-type"] || "application/json"), "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff" },
    });
  } catch (error) {
    return jsonError(axios.isAxiosError(error) && error.code === "ECONNABORTED" ? "Backend quá thời gian chờ." : "Không thể kết nối backend hoặc cấu hình URL chưa hợp lệ.", 502);
  }
}
