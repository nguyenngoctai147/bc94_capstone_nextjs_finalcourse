import { proxyBackend } from "@/lib/api/backend-proxy";
export const runtime = "nodejs";
async function handler(request: Request, context: { params: Promise<{ path: string[] }> }) {
  const { path } = await context.params;
  return proxyBackend(request, path);
}
export { handler as GET, handler as POST, handler as PUT, handler as PATCH, handler as DELETE };
