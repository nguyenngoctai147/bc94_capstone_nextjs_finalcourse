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
import { reviewsService } from "./reviews.service";
import type { Review, CreateReview, UpdateReview } from "./reviews.types";

export const fetchReviews = createAsyncThunk<Page<Review>, QueryParams | void, ApiThunkConfig>(
  "reviews/list",
  async (params, { getState, signal, rejectWithValue }) => {
    try {
      const result = await reviewsService.list({ signal, token: getState().auth.token, params: params || undefined });
      return result;
    } catch (error) {
      return rejectWithValue(toApiError(error));
    }
  },
);

export const fetchReviewDetail = createAsyncThunk<Review, number, ApiThunkConfig>(
  "reviews/detail",
  async (id, { getState, signal, rejectWithValue }) => {
    try {
      const result = await reviewsService.detail(id, { signal, token: getState().auth.token });
      return result;
    } catch (error) {
      return rejectWithValue(toApiError(error));
    }
  },
);

export const createReview = createAsyncThunk<Review, CreateReview, ApiThunkConfig>(
  "reviews/create",
  async (data, { getState, signal, rejectWithValue }) => {
    try {
      const result = await reviewsService.create(data, { signal, token: getState().auth.token });
      return result;
    } catch (error) {
      return rejectWithValue(toApiError(error));
    }
  },
);

export const updateReview = createAsyncThunk<Review, { id: number; data: UpdateReview }, ApiThunkConfig>(
  "reviews/update",
  async ({ id, data }, { getState, signal, rejectWithValue }) => {
    try {
      const result = await reviewsService.update(id, data, { signal, token: getState().auth.token });
      return result;
    } catch (error) {
      return rejectWithValue(toApiError(error));
    }
  },
);

export const patchReview = createAsyncThunk<Review, { id: number; data: Partial<UpdateReview> }, ApiThunkConfig>(
  "reviews/patch",
  async ({ id, data }, { getState, signal, rejectWithValue }) => {
    try {
      const result = await reviewsService.patch(id, data, { signal, token: getState().auth.token });
      return result;
    } catch (error) {
      return rejectWithValue(toApiError(error));
    }
  },
);

export const deleteReview = createAsyncThunk<number, number, ApiThunkConfig>(
  "reviews/remove",
  async (id, { getState, signal, rejectWithValue }) => {
    try {
      const result = await reviewsService.remove(id, { signal, token: getState().auth.token });
      return result;
    } catch (error) {
      return rejectWithValue(toApiError(error));
    }
  },
);

const initialState = createResourceState<Review>();

const reviewsSlice = createSlice({
  name: "reviews",
  initialState,
  reducers: {
    reset: () => createResourceState<Review>(),
  },
  extraReducers: (builder) => {
    builder.addCase(fetchReviews.pending, (state, action) => {
      startRequest(state.requests.list, action.meta.requestId);
    });
    builder.addCase(fetchReviews.fulfilled, (state, action) => {
      if (!finishRequest(state.requests.list, action.meta.requestId)) return;
      state.items = action.payload.data;
      state.total = action.payload.totalRow;
      state.pageIndex = action.payload.pageIndex;
      state.pageSize = action.payload.pageSize;
      state.invalidated = false;
    });
    builder.addCase(fetchReviews.rejected, (state, action) => {
      failRequest(state.requests.list, action);
    });

    builder.addCase(fetchReviewDetail.pending, (state, action) => {
      startRequest(state.requests.detail, action.meta.requestId);
      state.selected = null;
    });
    builder.addCase(fetchReviewDetail.fulfilled, (state, action) => {
      if (!finishRequest(state.requests.detail, action.meta.requestId)) return;
      state.selected = action.payload;
    });
    builder.addCase(fetchReviewDetail.rejected, (state, action) => {
      failRequest(state.requests.detail, action);
    });

    builder.addCase(createReview.pending, (state, action) => {
      startRequest(state.requests.create, action.meta.requestId);
    });
    builder.addCase(createReview.fulfilled, (state, action) => {
      if (!finishRequest(state.requests.create, action.meta.requestId)) return;
      state.invalidated = true;
    });
    builder.addCase(createReview.rejected, (state, action) => {
      failRequest(state.requests.create, action);
    });

    builder.addCase(updateReview.pending, (state, action) => {
      startRequest(state.requests.update, action.meta.requestId);
    });
    builder.addCase(updateReview.fulfilled, (state, action) => {
      if (!finishRequest(state.requests.update, action.meta.requestId)) return;
      state.invalidated = true;
    });
    builder.addCase(updateReview.rejected, (state, action) => {
      failRequest(state.requests.update, action);
    });

    builder.addCase(patchReview.pending, (state, action) => {
      startRequest(state.requests.patch, action.meta.requestId);
    });
    builder.addCase(patchReview.fulfilled, (state, action) => {
      if (!finishRequest(state.requests.patch, action.meta.requestId)) return;
      state.invalidated = true;
    });
    builder.addCase(patchReview.rejected, (state, action) => {
      failRequest(state.requests.patch, action);
    });

    builder.addCase(deleteReview.pending, (state, action) => {
      startRequest(state.requests.remove, action.meta.requestId);
    });
    builder.addCase(deleteReview.fulfilled, (state, action) => {
      if (!finishRequest(state.requests.remove, action.meta.requestId)) return;
      state.items = state.items.filter((item) => item.id !== action.payload);
      if (state.selected?.id === action.payload) state.selected = null;
      state.invalidated = true;
    });
    builder.addCase(deleteReview.rejected, (state, action) => {
      failRequest(state.requests.remove, action);
    });

  },
});

export const reviewsActions = reviewsSlice.actions;
export default reviewsSlice.reducer;
