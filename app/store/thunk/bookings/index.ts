import { createAsyncThunk } from "@reduxjs/toolkit";
import { bookingsService } from "@/features/bookings/bookings.service";
import { toApiError } from "@/services/api-utils";
import type { Page, QueryParams } from "@/types/api";
import type { ApiThunkConfig } from "@/store/type/request";
import type { Booking, CreateBooking, UpdateBooking } from "@/store/type/bookings";

export const fetchBookings = createAsyncThunk<Page<Booking>, QueryParams | void, ApiThunkConfig>(
  "bookings/list",
  async (params, { getState, signal, rejectWithValue }) => {
    try {
      return await bookingsService.list({ signal, token: getState().auth.token, params: params || undefined });
    } catch (error) {
      return rejectWithValue(toApiError(error));
    }
  },
);

export const fetchBookingDetail = createAsyncThunk<Booking, number, ApiThunkConfig>(
  "bookings/detail",
  async (id, { getState, signal, rejectWithValue }) => {
    try {
      return await bookingsService.detail(id, { signal, token: getState().auth.token });
    } catch (error) {
      return rejectWithValue(toApiError(error));
    }
  },
);

export const createBooking = createAsyncThunk<Booking, CreateBooking, ApiThunkConfig>(
  "bookings/create",
  async (data, { getState, signal, rejectWithValue }) => {
    try {
      return await bookingsService.create(data, { signal, token: getState().auth.token });
    } catch (error) {
      return rejectWithValue(toApiError(error));
    }
  },
);

export const updateBooking = createAsyncThunk<
  Booking,
  { id: number; data: UpdateBooking },
  ApiThunkConfig
>("bookings/update", async ({ id, data }, { getState, signal, rejectWithValue }) => {
  const auth = getState().auth;
  if (auth.user?.role.trim().toUpperCase() !== "ADMIN") {
    return rejectWithValue({
      status: 403,
      message: "Chỉ quản trị viên được phép sửa đặt phòng.",
    });
  }
  try {
    return await bookingsService.update(id, data, { signal, token: auth.token });
  } catch (error) {
    return rejectWithValue(toApiError(error));
  }
});

export const patchBooking = createAsyncThunk<
  Booking,
  { id: number; data: Partial<UpdateBooking> },
  ApiThunkConfig
>("bookings/patch", async ({ id, data }, { getState, signal, rejectWithValue }) => {
  try {
    return await bookingsService.patch(id, data, { signal, token: getState().auth.token });
  } catch (error) {
    return rejectWithValue(toApiError(error));
  }
});

export const deleteBooking = createAsyncThunk<number, number, ApiThunkConfig>(
  "bookings/remove",
  async (id, { getState, signal, rejectWithValue }) => {
    try {
      return await bookingsService.remove(id, { signal, token: getState().auth.token });
    } catch (error) {
      return rejectWithValue(toApiError(error));
    }
  },
);
