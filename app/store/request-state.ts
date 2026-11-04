import type { ApiError } from "@/types/api";
import type { RequestState, ResourceState } from "@/store/type/request";

export type { ApiThunkConfig, RequestState, ResourceState } from "@/store/type/request";

export const createRequestState = (): RequestState => ({
  status: "idle",
  error: null,
});

export function createResourceState<T>(): ResourceState<T> {
  return {
    items: [],
    selected: null,
    total: 0,
    pageIndex: 1,
    pageSize: 10,
    invalidated: false,
    requests: {
      list: createRequestState(),
      detail: createRequestState(),
      create: createRequestState(),
      update: createRequestState(),
      patch: createRequestState(),
      remove: createRequestState(),
    },
  };
}

export function startRequest(request: RequestState, requestId: string) {
  request.status = "loading";
  request.error = null;
  request.requestId = requestId;
}

export function finishRequest(request: RequestState, requestId: string) {
  if (request.requestId !== requestId) return false;
  request.status = "succeeded";
  request.error = null;
  request.requestId = undefined;
  return true;
}

export function failRequest(
  request: RequestState,
  action: {
    meta: { requestId: string; aborted: boolean };
    payload?: ApiError;
    error: { message?: string };
  },
) {
  if (request.requestId !== action.meta.requestId) return;
  request.status = action.meta.aborted ? "idle" : "failed";
  request.error = action.meta.aborted
    ? null
    : action.payload ?? {
        status: 0,
        message: action.error.message ?? "Có lỗi xảy ra.",
      };
  request.requestId = undefined;
}
