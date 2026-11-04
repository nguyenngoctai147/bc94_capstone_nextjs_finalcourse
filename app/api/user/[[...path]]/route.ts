import {
  proxyCoreResource,
  type ApiPathContext,
} from "@/api/_shared/proxy-route";
import { CORE_USERS_ENDPOINT } from "@/route/core.api";

export const runtime = "nodejs";

const handler = (request: Request, context: ApiPathContext) =>
  proxyCoreResource(request, context, CORE_USERS_ENDPOINT);

export { handler as GET, handler as POST, handler as PUT, handler as DELETE };
