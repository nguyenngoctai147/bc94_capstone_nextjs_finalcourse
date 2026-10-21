import { createSlice } from "@reduxjs/toolkit";
import type { ApiError } from "@/lib/api/types";
import type { Room } from "./rooms.types";
import { fetchRoomsByLocation } from "./rooms.slice";

type LocationRoomsState = {
  locationId: number | null;
  items: Room[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: ApiError | null;
  requestId?: string;
};

const initialState: LocationRoomsState = {
  locationId: null,
  items: [],
  status: "idle",
  error: null,
};

const locationRoomsSlice = createSlice({
  name: "locationRooms",
  initialState,
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

export default locationRoomsSlice.reducer;
