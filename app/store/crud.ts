import { createSlice, type AsyncThunk, type Draft } from "@reduxjs/toolkit";
import type { createCrudService } from "@/lib/api/crud-service";
import type { ApiError, Page, QueryParams } from "@/lib/api/types";
import { createRequestThunk, type ApiThunkConfig } from "./create-api-thunk";

export type RequestState = { status: "idle" | "loading" | "succeeded" | "failed"; error: ApiError | null; requestId?: string };
type Operation = "list" | "detail" | "create" | "update" | "patch" | "remove";
export type CrudState<T> = {
  items: T[]; selected: T | null; total: number; pageIndex: number; pageSize: number;
  invalidated: boolean; requests: Record<Operation, RequestState>;
};
const idle = (): RequestState => ({ status: "idle", error: null });
export const createCrudState = <T>(): CrudState<T> => ({
  items: [], selected: null, total: 0, pageIndex: 1, pageSize: 10, invalidated: false,
  requests: { list: idle(), detail: idle(), create: idle(), update: idle(), patch: idle(), remove: idle() },
});

export function createCrudThunks<T extends { id: number }, Create, Update>(
  name: string, service: ReturnType<typeof createCrudService<T, Create, Update>>,
) {
  return {
    list: createRequestThunk<Page<T>, QueryParams | void>(`${name}/list`, (params, options) => service.list({ ...options, params: params || undefined })),
    detail: createRequestThunk<T, number>(`${name}/detail`, (id, options) => service.detail(id, options)),
    create: createRequestThunk<T, Create>(`${name}/create`, (data, options) => service.create(data, options)),
    update: createRequestThunk<T, { id: number; data: Update }>(`${name}/update`, ({ id, data }, options) => service.update(id, data, options)),
    patch: createRequestThunk<T, { id: number; data: Partial<Update> }>(`${name}/patch`, ({ id, data }, options) => service.patch(id, data, options)),
    remove: createRequestThunk<number, number>(`${name}/remove`, (id, options) => service.remove(id, options)),
  };
}

export function createCrudSlice<T extends { id: number }, Create, Update>(
  name: string, thunks: ReturnType<typeof createCrudThunks<T, Create, Update>>,
) {
  return createSlice({
    name, initialState: createCrudState<T>(),
    reducers: { reset: () => createCrudState<T>() },
    extraReducers: (builder) => {
      function attach<Result, Arg>(
        thunk: AsyncThunk<Result, Arg, ApiThunkConfig>, operation: Operation,
        onSuccess?: (state: Draft<CrudState<T>>, payload: Result) => void,
      ) {
        builder.addCase(thunk.pending, (state, action) => {
          state.requests[operation] = { status: "loading", error: null, requestId: action.meta.requestId };
          if (operation === "detail") state.selected = null;
        });
        builder.addCase(thunk.fulfilled, (state, action) => {
          if (state.requests[operation].requestId !== action.meta.requestId) return;
          state.requests[operation] = { status: "succeeded", error: null };
          onSuccess?.(state, action.payload);
        });
        builder.addCase(thunk.rejected, (state, action) => {
          if (state.requests[operation].requestId !== action.meta.requestId) return;
          state.requests[operation] = action.meta.aborted ? idle() : {
            status: "failed", error: action.payload ?? { status: 0, message: action.error.message ?? "Có lỗi xảy ra." },
          };
        });
      }
      attach(thunks.list, "list", (state, page) => {
        state.items = page.data as Draft<T>[];
        state.total = page.totalRow; state.pageIndex = page.pageIndex; state.pageSize = page.pageSize;
        state.invalidated = false;
      });
      attach(thunks.detail, "detail", (state, payload) => { state.selected = payload as Draft<CrudState<T>>["selected"]; });
      // Swagger does not specify write response schemas. Reload the list after a successful mutation.
      attach(thunks.create, "create", (state) => { state.invalidated = true; });
      attach(thunks.update, "update", (state) => { state.invalidated = true; });
      attach(thunks.patch, "patch", (state) => { state.invalidated = true; });
      attach(thunks.remove, "remove", (state, id) => {
        state.invalidated = true;
        state.items = state.items.filter((item) => item.id !== id);
        if (state.selected?.id === id) state.selected = null;
      });
    },
  });
}
