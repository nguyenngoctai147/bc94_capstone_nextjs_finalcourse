import { createAsyncThunk } from "@reduxjs/toolkit";
import { roomsService } from "@/features/rooms/rooms.service";
import { toApiError } from "@/services/api-utils";
import type { Page, QueryParams } from "@/types/api";
import type { ApiThunkConfig } from "@/store/type/request";
import type { CreateRoom, Room, UpdateRoom } from "@/store/type/room";

export const fetchRooms = createAsyncThunk<Page<Room>, QueryParams | void, ApiThunkConfig>(
  "rooms/list",
  async (params, { getState, signal, rejectWithValue }) => {
    try {
      return await roomsService.list({
        signal,
        token: getState().auth.token,
        params: params || undefined,
      });
    } catch (error) {
      return rejectWithValue(toApiError(error));
    }
  },
);

export const fetchRoomDetail = createAsyncThunk<Room, number, ApiThunkConfig>(
  "rooms/detail",
  async (id, { getState, signal, rejectWithValue }) => {
    try {
      return await roomsService.detail(id, { signal, token: getState().auth.token });
    } catch (error) {
      return rejectWithValue(toApiError(error));
    }
  },
);

export const createRoom = createAsyncThunk<Room, CreateRoom, ApiThunkConfig>(
  "rooms/create",
  async (data, { getState, signal, rejectWithValue }) => {
    try {
      return await roomsService.create(data, { signal, token: getState().auth.token });
    } catch (error) {
      return rejectWithValue(toApiError(error));
    }
  },
);

export const updateRoom = createAsyncThunk<
  Room,
  { id: number; data: UpdateRoom },
  ApiThunkConfig
>("rooms/update", async ({ id, data }, { getState, signal, rejectWithValue }) => {
  try {
    return await roomsService.update(id, data, { signal, token: getState().auth.token });
  } catch (error) {
    return rejectWithValue(toApiError(error));
  }
});

export const patchRoom = createAsyncThunk<
  Room,
  { id: number; data: Partial<UpdateRoom> },
  ApiThunkConfig
>("rooms/patch", async ({ id, data }, { getState, signal, rejectWithValue }) => {
  try {
    return await roomsService.patch(id, data, { signal, token: getState().auth.token });
  } catch (error) {
    return rejectWithValue(toApiError(error));
  }
});

export const deleteRoom = createAsyncThunk<number, number, ApiThunkConfig>(
  "rooms/remove",
  async (id, { getState, signal, rejectWithValue }) => {
    try {
      return await roomsService.remove(id, { signal, token: getState().auth.token });
    } catch (error) {
      return rejectWithValue(toApiError(error));
    }
  },
);

export const fetchRoomsByLocation = createAsyncThunk<Room[], number, ApiThunkConfig>(
  "rooms/byLocation",
  async (locationId, { getState, signal, rejectWithValue }) => {
    try {
      return await roomsService.byLocation(locationId, {
        signal,
        token: getState().auth.token,
      });
    } catch (error) {
      return rejectWithValue(toApiError(error));
    }
  },
);
