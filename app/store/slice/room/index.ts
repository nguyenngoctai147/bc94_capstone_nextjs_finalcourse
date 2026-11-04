import { createSlice } from "@reduxjs/toolkit";
import {
  createResourceState,
  failRequest,
  finishRequest,
  startRequest,
} from "@/store/request-state";
import {
  createRoom,
  deleteRoom,
  fetchRoomDetail,
  fetchRooms,
  fetchRoomsByLocation,
  patchRoom,
  updateRoom,
} from "@/store/thunk/room";
import type { LocationRoomsState, Room } from "@/store/type/room";
import type { ResourceState } from "@/store/type/request";

const initialState: ResourceState<Room> = createResourceState<Room>();

export const roomsSlice = createSlice({
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

const locationRoomsInitialState: LocationRoomsState = {
  locationId: null,
  items: [],
  status: "idle",
  error: null,
};

export const locationRoomsSlice = createSlice({
  name: "locationRooms",
  initialState: locationRoomsInitialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchRoomsByLocation.pending, (state, action) => {
      state.locationId = action.meta.arg;
      state.items = [];
      state.status = "loading";
      state.error = null;
      state.requestId = action.meta.requestId;
    });
    builder.addCase(fetchRoomsByLocation.fulfilled, (state, action) => {
      if (state.requestId !== action.meta.requestId) return;
      state.items = action.payload;
      state.status = "succeeded";
      state.error = null;
      state.requestId = undefined;
    });
    builder.addCase(fetchRoomsByLocation.rejected, (state, action) => {
      if (state.requestId !== action.meta.requestId) return;
      state.status = action.meta.aborted ? "idle" : "failed";
      state.error = action.meta.aborted
        ? null
        : (action.payload ?? { status: 0, message: "Không thể tải phòng tại vị trí này." });
      state.requestId = undefined;
    });
  },
});

export const roomsActions = roomsSlice.actions;
export default roomsSlice.reducer;
