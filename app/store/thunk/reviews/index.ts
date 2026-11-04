import { createAsyncThunk } from "@reduxjs/toolkit";
import { reviewsService } from "@/features/reviews/reviews.service";
import { toApiError } from "@/services/api-utils";
import type { Page, QueryParams } from "@/types/api";
import type { ApiThunkConfig } from "@/store/type/request";
import type { CreateReview, Review, UpdateReview } from "@/store/type/reviews";

export const fetchReviews = createAsyncThunk<Page<Review>, QueryParams | void, ApiThunkConfig>(
  "reviews/list",
  async (params, { getState, signal, rejectWithValue }) => {
    try {
      return await reviewsService.list({ signal, token: getState().auth.token, params: params || undefined });
    } catch (error) {
      return rejectWithValue(toApiError(error));
    }
  },
);

export const fetchReviewDetail = createAsyncThunk<Review, number, ApiThunkConfig>(
  "reviews/detail",
  async (id, { getState, signal, rejectWithValue }) => {
    try {
      return await reviewsService.detail(id, { signal, token: getState().auth.token });
    } catch (error) {
      return rejectWithValue(toApiError(error));
    }
  },
);

export const createReview = createAsyncThunk<Review, CreateReview, ApiThunkConfig>(
  "reviews/create",
  async (data, { getState, signal, rejectWithValue }) => {
    try {
      return await reviewsService.create(data, { signal, token: getState().auth.token });
    } catch (error) {
      return rejectWithValue(toApiError(error));
    }
  },
);

export const updateReview = createAsyncThunk<Review, { id: number; data: UpdateReview }, ApiThunkConfig>(
  "reviews/update",
  async ({ id, data }, { getState, signal, rejectWithValue }) => {
    try {
      return await reviewsService.update(id, data, { signal, token: getState().auth.token });
    } catch (error) {
      return rejectWithValue(toApiError(error));
    }
  },
);

export const patchReview = createAsyncThunk<Review, { id: number; data: Partial<UpdateReview> }, ApiThunkConfig>(
  "reviews/patch",
  async ({ id, data }, { getState, signal, rejectWithValue }) => {
    try {
      return await reviewsService.patch(id, data, { signal, token: getState().auth.token });
    } catch (error) {
      return rejectWithValue(toApiError(error));
    }
  },
);

export const deleteReview = createAsyncThunk<number, number, ApiThunkConfig>(
  "reviews/remove",
  async (id, { getState, signal, rejectWithValue }) => {
    try {
      return await reviewsService.remove(id, { signal, token: getState().auth.token });
    } catch (error) {
      return rejectWithValue(toApiError(error));
    }
  },
);
