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
import { bookingsService } from "./bookings.service";
import type { Booking, CreateBooking, UpdateBooking } from "./bookings.types";

export const fetchBookings = createAsyncThunk<Page<Booking>, QueryParams | void, ApiThunkConfig>(
  "bookings/list",
  async (params, { getState, signal, rejectWithValue }) => {
    try {
      const result = await bookingsService.list({ signal, token: getState().auth.token, params: params || undefined });
      return result;
    } catch (error) {
      return rejectWithValue(toApiError(error));
    }
  },
);

export const fetchBookingDetail = createAsyncThunk<Booking, number, ApiThunkConfig>(
  "bookings/detail",
  async (id, { getState, signal, rejectWithValue }) => {
    try {
      const result = await bookingsService.detail(id, { signal, token: getState().auth.token });
      return result;
    } catch (error) {
      return rejectWithValue(toApiError(error));
    }
  },
);

export const createBooking = createAsyncThunk<Booking, CreateBooking, ApiThunkConfig>(
  "bookings/create",
  async (data, { getState, signal, rejectWithValue }) => {
    try {
      const result = await bookingsService.create(data, { signal, token: getState().auth.token });
      return result;
    } catch (error) {
      return rejectWithValue(toApiError(error));
    }
  },
);

export const updateBooking = createAsyncThunk<Booking, { id: number; data: UpdateBooking }, ApiThunkConfig>(
  "bookings/update",
  async ({ id, data }, { getState, signal, rejectWithValue }) => {
    const auth = getState().auth;
    if (auth.user?.role.trim().toUpperCase() !== "ADMIN") {
      return rejectWithValue({
        status: 403,
        message: "Chỉ quản trị viên được phép sửa đặt phòng.",
      });
    }
    try {
      const result = await bookingsService.update(id, data, { signal, token: auth.token });
      return result;
    } catch (error) {
      return rejectWithValue(toApiError(error));
    }
  },
);

export const patchBooking = createAsyncThunk<Booking, { id: number; data: Partial<UpdateBooking> }, ApiThunkConfig>(
  "bookings/patch",
  async ({ id, data }, { getState, signal, rejectWithValue }) => {
    try {
      const result = await bookingsService.patch(id, data, { signal, token: getState().auth.token });
      return result;
    } catch (error) {
      return rejectWithValue(toApiError(error));
    }
  },
);

export const deleteBooking = createAsyncThunk<number, number, ApiThunkConfig>(
  "bookings/remove",
  async (id, { getState, signal, rejectWithValue }) => {
    try {
      const result = await bookingsService.remove(id, { signal, token: getState().auth.token });
      return result;
    } catch (error) {
      return rejectWithValue(toApiError(error));
    }
  },
);

const initialState = createResourceState<Booking>();

const bookingsSlice = createSlice({
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
