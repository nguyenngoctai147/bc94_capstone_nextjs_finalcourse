import { proxyBackend } from "@/services/proxy";

export type ApiPathContext = {
  params: Promise<{ path?: string[] }>;
};

const toSegments = (endpoint: string) =>
  endpoint.split("/").filter(Boolean);

export const proxyCoreEndpoint = (request: Request, endpoint: string) =>
  proxyBackend(request, toSegments(endpoint));

export async function proxyCoreResource(
  request: Request,
  context: ApiPathContext,
  endpoint: string,
) {
  const { path = [] } = await context.params;
  return proxyBackend(request, [...toSegments(endpoint), ...path]);
}
