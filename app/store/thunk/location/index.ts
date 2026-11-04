import { createAsyncThunk } from "@reduxjs/toolkit";
import { locationsService } from "@/features/locations/locations.service";
import { toApiError } from "@/services/api-utils";
import type { Page, QueryParams } from "@/types/api";
import type { ApiThunkConfig } from "@/store/type/request";
import type { CreateLocation, Location, UpdateLocation } from "@/store/type/location";

export const fetchLocations = createAsyncThunk<Page<Location>, QueryParams | void, ApiThunkConfig>(
  "locations/list",
  async (params, { getState, signal, rejectWithValue }) => {
    try {
      return await locationsService.list({ signal, token: getState().auth.token, params: params || undefined });
    } catch (error) {
      return rejectWithValue(toApiError(error));
    }
  },
);

export const fetchLocationDetail = createAsyncThunk<Location, number, ApiThunkConfig>(
  "locations/detail",
  async (id, { getState, signal, rejectWithValue }) => {
    try {
      return await locationsService.detail(id, { signal, token: getState().auth.token });
    } catch (error) {
      return rejectWithValue(toApiError(error));
    }
  },
);

export const createLocation = createAsyncThunk<Location, CreateLocation, ApiThunkConfig>(
  "locations/create",
  async (data, { getState, signal, rejectWithValue }) => {
    try {
      return await locationsService.create(data, { signal, token: getState().auth.token });
    } catch (error) {
      return rejectWithValue(toApiError(error));
    }
  },
);

export const updateLocation = createAsyncThunk<Location, { id: number; data: UpdateLocation }, ApiThunkConfig>(
  "locations/update",
  async ({ id, data }, { getState, signal, rejectWithValue }) => {
    try {
      return await locationsService.update(id, data, { signal, token: getState().auth.token });
    } catch (error) {
      return rejectWithValue(toApiError(error));
    }
  },
);

export const patchLocation = createAsyncThunk<Location, { id: number; data: Partial<UpdateLocation> }, ApiThunkConfig>(
  "locations/patch",
  async ({ id, data }, { getState, signal, rejectWithValue }) => {
    try {
      return await locationsService.patch(id, data, { signal, token: getState().auth.token });
    } catch (error) {
      return rejectWithValue(toApiError(error));
    }
  },
);

export const deleteLocation = createAsyncThunk<number, number, ApiThunkConfig>(
  "locations/remove",
  async (id, { getState, signal, rejectWithValue }) => {
    try {
      return await locationsService.remove(id, { signal, token: getState().auth.token });
    } catch (error) {
      return rejectWithValue(toApiError(error));
    }
  },
);
