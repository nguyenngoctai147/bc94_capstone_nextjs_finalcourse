import { createSlice } from "@reduxjs/toolkit";
import {
  createResourceState,
  failRequest,
  finishRequest,
  startRequest,
} from "@/store/request-state";
import {
  createBooking,
  deleteBooking,
  fetchBookingDetail,
  fetchBookings,
  patchBooking,
  updateBooking,
} from "@/store/thunk/bookings";
import type { Booking } from "@/store/type/bookings";
import type { ResourceState } from "@/store/type/request";

const initialState: ResourceState<Booking> = createResourceState<Booking>();

export const bookingsSlice = createSlice({
  name: "bookings",
  initialState,
  reducers: {
    reset: () => createResourceState<Booking>(),
  },
  extraReducers: (builder) => {
    builder.addCase(fetchBookings.pending, (state, action) => {
      startRequest(state.requests.list, action.meta.requestId);
    });
    builder.addCase(fetchBookings.fulfilled, (state, action) => {
      if (!finishRequest(state.requests.list, action.meta.requestId)) return;

      state.items = action.payload.data;
      state.total = action.payload.totalRow;
      state.pageIndex = action.payload.pageIndex;
      state.pageSize = action.payload.pageSize;
      state.invalidated = false;
    });
    builder.addCase(fetchBookings.rejected, (state, action) => {
      failRequest(state.requests.list, action);
    });
    builder.addCase(fetchBookingDetail.pending, (state, action) => {
      startRequest(state.requests.detail, action.meta.requestId);
      state.selected = null;
    });
    builder.addCase(fetchBookingDetail.fulfilled, (state, action) => {
      if (!finishRequest(state.requests.detail, action.meta.requestId)) return;

      state.selected = action.payload;
    });
    builder.addCase(fetchBookingDetail.rejected, (state, action) => {
      failRequest(state.requests.detail, action);
    });

    builder.addCase(createBooking.pending, (state, action) => {
      startRequest(state.requests.create, action.meta.requestId);
    });
    builder.addCase(createBooking.fulfilled, (state, action) => {
      if (!finishRequest(state.requests.create, action.meta.requestId)) return;

      state.invalidated = true;
    });
    builder.addCase(createBooking.rejected, (state, action) => {
      failRequest(state.requests.create, action);
    });

    builder.addCase(updateBooking.pending, (state, action) => {
      startRequest(state.requests.update, action.meta.requestId);
    });
    builder.addCase(updateBooking.fulfilled, (state, action) => {
      if (!finishRequest(state.requests.update, action.meta.requestId)) return;

      state.invalidated = true;
    });
    builder.addCase(updateBooking.rejected, (state, action) => {
      failRequest(state.requests.update, action);
    });

    builder.addCase(patchBooking.pending, (state, action) => {
      startRequest(state.requests.patch, action.meta.requestId);
    });
    builder.addCase(patchBooking.fulfilled, (state, action) => {
      if (!finishRequest(state.requests.patch, action.meta.requestId)) return;

      state.invalidated = true;
    });
    builder.addCase(patchBooking.rejected, (state, action) => {
      failRequest(state.requests.patch, action);
    });

    builder.addCase(deleteBooking.pending, (state, action) => {
      startRequest(state.requests.remove, action.meta.requestId);
    });
    builder.addCase(deleteBooking.fulfilled, (state, action) => {
      if (!finishRequest(state.requests.remove, action.meta.requestId)) return;

      state.items = state.items.filter((item) => item.id !== action.payload);
      if (state.selected?.id === action.payload) state.selected = null;
      state.invalidated = true;
    });
    builder.addCase(deleteBooking.rejected, (state, action) => {
      failRequest(state.requests.remove, action);
    });
  },
});

export const bookingsActions = bookingsSlice.actions;
export default bookingsSlice.reducer;
