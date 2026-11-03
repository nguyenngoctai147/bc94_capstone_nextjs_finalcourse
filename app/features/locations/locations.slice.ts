import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toApiError } from "@/lib/api/errors";
import type { Page, QueryParams } from "@/lib/api/types";
import {
  createResourceState,
  startRequest,
  finishRequest,
  failRequest,
  type ApiThunkConfig,
} from "@/store/request-state";
import { locationsService } from "./locations.service";
import type { Location, CreateLocation, UpdateLocation } from "./locations.types";

export const fetchLocations = createAsyncThunk<Page<Location>, QueryParams | void, ApiThunkConfig>(
  "locations/list",
  async (params, { getState, signal, rejectWithValue }) => {
    try {
      const result = await locationsService.list({ signal, token: getState().auth.token, params: params || undefined });
      return result;
    } catch (error) {
      return rejectWithValue(toApiError(error));
    }
  },
);

export const fetchLocationDetail = createAsyncThunk<Location, number, ApiThunkConfig>(
  "locations/detail",
  async (id, { getState, signal, rejectWithValue }) => {
    try {
      const result = await locationsService.detail(id, { signal, token: getState().auth.token });
      return result;
    } catch (error) {
      return rejectWithValue(toApiError(error));
    }
  },
);

export const createLocation = createAsyncThunk<Location, CreateLocation, ApiThunkConfig>(
  "locations/create",
  async (data, { getState, signal, rejectWithValue }) => {
    try {
      const result = await locationsService.create(data, { signal, token: getState().auth.token });
      return result;
    } catch (error) {
      return rejectWithValue(toApiError(error));
    }
  },
);

export const updateLocation = createAsyncThunk<Location, { id: number; data: UpdateLocation }, ApiThunkConfig>(
  "locations/update",
  async ({ id, data }, { getState, signal, rejectWithValue }) => {
    try {
      const result = await locationsService.update(id, data, { signal, token: getState().auth.token });
      return result;
    } catch (error) {
      return rejectWithValue(toApiError(error));
    }
  },
);

export const patchLocation = createAsyncThunk<Location, { id: number; data: Partial<UpdateLocation> }, ApiThunkConfig>(
  "locations/patch",
  async ({ id, data }, { getState, signal, rejectWithValue }) => {
    try {
      const result = await locationsService.patch(id, data, { signal, token: getState().auth.token });
      return result;
    } catch (error) {
      return rejectWithValue(toApiError(error));
    }
  },
);

export const deleteLocation = createAsyncThunk<number, number, ApiThunkConfig>(
  "locations/remove",
  async (id, { getState, signal, rejectWithValue }) => {
    try {
      const result = await locationsService.remove(id, { signal, token: getState().auth.token });
      return result;
    } catch (error) {
      return rejectWithValue(toApiError(error));
    }
  },
);

const initialState = createResourceState<Location>();

const locationsSlice = createSlice({
  name: "locations",
  initialState,
  reducers: {
    reset: () => createResourceState<Location>(),
  },
  extraReducers: (builder) => {
    builder.addCase(fetchLocations.pending, (state, action) => {
      startRequest(state.requests.list, action.meta.requestId);
    });
    builder.addCase(fetchLocations.fulfilled, (state, action) => {
      if (!finishRequest(state.requests.list, action.meta.requestId)) return;
      state.items = action.payload.data;
      state.total = action.payload.totalRow;
      state.pageIndex = action.payload.pageIndex;
      state.pageSize = action.payload.pageSize;
      state.invalidated = false;
    });
    builder.addCase(fetchLocations.rejected, (state, action) => {
      failRequest(state.requests.list, action);
    });

    builder.addCase(fetchLocationDetail.pending, (state, action) => {
      startRequest(state.requests.detail, action.meta.requestId);
      state.selected = null;
    });
    builder.addCase(fetchLocationDetail.fulfilled, (state, action) => {
      if (!finishRequest(state.requests.detail, action.meta.requestId)) return;
      state.selected = action.payload;
    });
    builder.addCase(fetchLocationDetail.rejected, (state, action) => {
      failRequest(state.requests.detail, action);
    });

    builder.addCase(createLocation.pending, (state, action) => {
      startRequest(state.requests.create, action.meta.requestId);
    });
    builder.addCase(createLocation.fulfilled, (state, action) => {
      if (!finishRequest(state.requests.create, action.meta.requestId)) return;
      state.invalidated = true;
    });
    builder.addCase(createLocation.rejected, (state, action) => {
      failRequest(state.requests.create, action);
    });

    builder.addCase(updateLocation.pending, (state, action) => {
      startRequest(state.requests.update, action.meta.requestId);
    });
    builder.addCase(updateLocation.fulfilled, (state, action) => {
      if (!finishRequest(state.requests.update, action.meta.requestId)) return;
      state.invalidated = true;
    });
    builder.addCase(updateLocation.rejected, (state, action) => {
      failRequest(state.requests.update, action);
    });

    builder.addCase(patchLocation.pending, (state, action) => {
      startRequest(state.requests.patch, action.meta.requestId);
    });
    builder.addCase(patchLocation.fulfilled, (state, action) => {
      if (!finishRequest(state.requests.patch, action.meta.requestId)) return;
      state.invalidated = true;
    });
    builder.addCase(patchLocation.rejected, (state, action) => {
      failRequest(state.requests.patch, action);
    });

    builder.addCase(deleteLocation.pending, (state, action) => {
      startRequest(state.requests.remove, action.meta.requestId);
    });
    builder.addCase(deleteLocation.fulfilled, (state, action) => {
      if (!finishRequest(state.requests.remove, action.meta.requestId)) return;
      state.items = state.items.filter((item) => item.id !== action.payload);
      if (state.selected?.id === action.payload) state.selected = null;
      state.invalidated = true;
    });
    builder.addCase(deleteLocation.rejected, (state, action) => {
      failRequest(state.requests.remove, action);
    });

  },
});

export const locationsActions = locationsSlice.actions;
export default locationsSlice.reducer;
