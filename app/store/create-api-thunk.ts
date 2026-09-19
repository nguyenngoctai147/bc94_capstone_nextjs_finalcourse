import { createAsyncThunk } from "@reduxjs/toolkit";
import { toApiError } from "@/lib/api/errors";
import type { ApiError, RequestOptions } from "@/lib/api/types";

// A minimal state contract prevents a circular dependency on the root reducer.
export type ApiThunkConfig = { state: { auth: { token: string | null } }; rejectValue: ApiError };
export const createApiThunk = createAsyncThunk.withTypes<ApiThunkConfig>();
export function createRequestThunk<Result, Arg>(
  name: string, request: (arg: Arg, options: RequestOptions) => Promise<Result>,
) {
  return createApiThunk<Result, Arg>(name, async (arg, { signal, getState, rejectWithValue }) => {
    try { return await request(arg, { signal, token: getState().auth.token }); }
    catch (error) { return rejectWithValue(toApiError(error)); }
  });
}
