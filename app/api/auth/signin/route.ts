import { proxyCoreEndpoint } from "@/api/_shared/proxy-route";
import { CORE_SIGNIN_ENDPOINT } from "@/route/core.api";

export const runtime = "nodejs";

export const POST = (request: Request) =>
  proxyCoreEndpoint(request, CORE_SIGNIN_ENDPOINT);
