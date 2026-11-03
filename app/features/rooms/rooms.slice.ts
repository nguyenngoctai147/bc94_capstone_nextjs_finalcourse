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
import { roomsService } from "./rooms.service";
import type { Room, CreateRoom, UpdateRoom } from "./rooms.types";

export const fetchRooms = createAsyncThunk<Page<Room>, QueryParams | void, ApiThunkConfig>(
  "rooms/list",
  async (params, { getState, signal, rejectWithValue }) => {
    try {
      const result = await roomsService.list({ signal, token: getState().auth.token, params: params || undefined });
      return result;
    } catch (error) {
      return rejectWithValue(toApiError(error));
    }
  },
);

export const fetchRoomDetail = createAsyncThunk<Room, number, ApiThunkConfig>(
  "rooms/detail",
  async (id, { getState, signal, rejectWithValue }) => {
    try {
      const result = await roomsService.detail(id, { signal, token: getState().auth.token });
      return result;
    } catch (error) {
      return rejectWithValue(toApiError(error));
    }
  },
);

export const createRoom = createAsyncThunk<Room, CreateRoom, ApiThunkConfig>(
  "rooms/create",
  async (data, { getState, signal, rejectWithValue }) => {
    try {
      const result = await roomsService.create(data, { signal, token: getState().auth.token });
      return result;
    } catch (error) {
      return rejectWithValue(toApiError(error));
    }
  },
);

export const updateRoom = createAsyncThunk<Room, { id: number; data: UpdateRoom }, ApiThunkConfig>(
  "rooms/update",
  async ({ id, data }, { getState, signal, rejectWithValue }) => {
    try {
      const result = await roomsService.update(id, data, { signal, token: getState().auth.token });
      return result;
    } catch (error) {
      return rejectWithValue(toApiError(error));
    }
  },
);

export const patchRoom = createAsyncThunk<Room, { id: number; data: Partial<UpdateRoom> }, ApiThunkConfig>(
  "rooms/patch",
  async ({ id, data }, { getState, signal, rejectWithValue }) => {
    try {
      const result = await roomsService.patch(id, data, { signal, token: getState().auth.token });
      return result;
    } catch (error) {
      return rejectWithValue(toApiError(error));
    }
  },
);

export const deleteRoom = createAsyncThunk<number, number, ApiThunkConfig>(
  "rooms/remove",
  async (id, { getState, signal, rejectWithValue }) => {
    try {
      const result = await roomsService.remove(id, { signal, token: getState().auth.token });
      return result;
    } catch (error) {
      return rejectWithValue(toApiError(error));
    }
  },
);

export const fetchRoomsByLocation = createAsyncThunk<Room[], number, ApiThunkConfig>(
  "rooms/byLocation",
  async (locationId, { getState, signal, rejectWithValue }) => {
    try {
      const result = await roomsService.byLocation(locationId, { signal, token: getState().auth.token });
      return result;
    } catch (error) {
      return rejectWithValue(toApiError(error));
    }
  },
);

const initialState = createResourceState<Room>();

const roomsSlice = createSlice({
  name: "rooms",
  initialState,
  reducers: {
    reset: () => createResourceState<Room>(),
  },
  extraReducers: (builder) => {
    builder.addCase(fetchRooms.pending, (state, action) => {
      startRequest(state.requests.list, action.meta.requestId);
    });
    builder.addCase(fetchRooms.fulfilled, (state, action) => {
      if (!finishRequest(state.requests.list, action.meta.requestId)) return;
      state.items = action.payload.data;
      state.total = action.payload.totalRow;
      state.pageIndex = action.payload.pageIndex;
      state.pageSize = action.payload.pageSize;
      state.invalidated = false;
    });
    builder.addCase(fetchRooms.rejected, (state, action) => {
      failRequest(state.requests.list, action);
    });

    builder.addCase(fetchRoomDetail.pending, (state, action) => {
      startRequest(state.requests.detail, action.meta.requestId);
      state.selected = null;
    });
    builder.addCase(fetchRoomDetail.fulfilled, (state, action) => {
      if (!finishRequest(state.requests.detail, action.meta.requestId)) return;
      state.selected = action.payload;
    });
    builder.addCase(fetchRoomDetail.rejected, (state, action) => {
      failRequest(state.requests.detail, action);
    });

    builder.addCase(createRoom.pending, (state, action) => {
      startRequest(state.requests.create, action.meta.requestId);
    });
    builder.addCase(createRoom.fulfilled, (state, action) => {
      if (!finishRequest(state.requests.create, action.meta.requestId)) return;
      state.invalidated = true;
    });
    builder.addCase(createRoom.rejected, (state, action) => {
      failRequest(state.requests.create, action);
    });

    builder.addCase(updateRoom.pending, (state, action) => {
      startRequest(state.requests.update, action.meta.requestId);
    });
    builder.addCase(updateRoom.fulfilled, (state, action) => {
      if (!finishRequest(state.requests.update, action.meta.requestId)) return;
      state.invalidated = true;
    });
    builder.addCase(updateRoom.rejected, (state, action) => {
      failRequest(state.requests.update, action);
    });

    builder.addCase(patchRoom.pending, (state, action) => {
      startRequest(state.requests.patch, action.meta.requestId);
    });
    builder.addCase(patchRoom.fulfilled, (state, action) => {
      if (!finishRequest(state.requests.patch, action.meta.requestId)) return;
      state.invalidated = true;
    });
    builder.addCase(patchRoom.rejected, (state, action) => {
      failRequest(state.requests.patch, action);
    });

    builder.addCase(deleteRoom.pending, (state, action) => {
      startRequest(state.requests.remove, action.meta.requestId);
    });
    builder.addCase(deleteRoom.fulfilled, (state, action) => {
      if (!finishRequest(state.requests.remove, action.meta.requestId)) return;
      state.items = state.items.filter((item) => item.id !== action.payload);
      if (state.selected?.id === action.payload) state.selected = null;
      state.invalidated = true;
    });
    builder.addCase(deleteRoom.rejected, (state, action) => {
      failRequest(state.requests.remove, action);
    });

  },
});

export const roomsActions = roomsSlice.actions;
export default roomsSlice.reducer;
