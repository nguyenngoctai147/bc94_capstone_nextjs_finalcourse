import { proxyCoreEndpoint } from "@/api/_shared/proxy-route";
import { CORE_USER_DETAIL_ENDPOINT } from "@/route/core.api";

export const runtime = "nodejs";

async function handler(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  return proxyCoreEndpoint(request, CORE_USER_DETAIL_ENDPOINT(id));
}

export { handler as GET, handler as PUT };
