import type { ApiError } from "@/types/api";

export type RequestStatus = "idle" | "loading" | "succeeded" | "failed";

export type RequestState = {
  status: RequestStatus;
  error: ApiError | null;
  requestId?: string;
};

export type ResourceState<T> = {
  items: T[];
  selected: T | null;
  total: number;
  pageIndex: number;
  pageSize: number;
  invalidated: boolean;
  requests: Record<
    "list" | "detail" | "create" | "update" | "patch" | "remove",
    RequestState
  >;
};

export type ApiThunkConfig = {
  state: {
    auth: {
      token: string | null;
      user: { role: string } | null;
    };
  };
  rejectValue: ApiError;
};
