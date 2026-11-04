import { createAsyncThunk } from "@reduxjs/toolkit";
import { usersService } from "@/features/users/users.service";
import { toApiError } from "@/services/api-utils";
import type { Page, QueryParams } from "@/types/api";
import type { ApiThunkConfig } from "@/store/type/request";
import type { CreateUser, UpdateUser, User } from "@/store/type/user";

export const fetchUsers = createAsyncThunk<Page<User>, QueryParams | void, ApiThunkConfig>(
  "users/list",
  async (params, { getState, signal, rejectWithValue }) => {
    try {
      return await usersService.list({ signal, token: getState().auth.token, params: params || undefined });
    } catch (error) {
      return rejectWithValue(toApiError(error));
    }
  },
);

export const fetchUserDetail = createAsyncThunk<User, number, ApiThunkConfig>(
  "users/detail",
  async (id, { getState, signal, rejectWithValue }) => {
    try {
      return await usersService.detail(id, { signal, token: getState().auth.token });
    } catch (error) {
      return rejectWithValue(toApiError(error));
    }
  },
);

export const createUser = createAsyncThunk<User, CreateUser, ApiThunkConfig>(
  "users/create",
  async (data, { getState, signal, rejectWithValue }) => {
    try {
      return await usersService.create(data, { signal, token: getState().auth.token });
    } catch (error) {
      return rejectWithValue(toApiError(error));
    }
  },
);

export const updateUser = createAsyncThunk<User, { id: number; data: UpdateUser }, ApiThunkConfig>(
  "users/update",
  async ({ id, data }, { getState, signal, rejectWithValue }) => {
    try {
      return await usersService.update(id, data, { signal, token: getState().auth.token });
    } catch (error) {
      return rejectWithValue(toApiError(error));
    }
  },
);

export const patchUser = createAsyncThunk<User, { id: number; data: Partial<UpdateUser> }, ApiThunkConfig>(
  "users/patch",
  async ({ id, data }, { getState, signal, rejectWithValue }) => {
    try {
      return await usersService.patch(id, data, { signal, token: getState().auth.token });
    } catch (error) {
      return rejectWithValue(toApiError(error));
    }
  },
);

export const deleteUser = createAsyncThunk<number, number, ApiThunkConfig>(
  "users/remove",
  async (id, { getState, signal, rejectWithValue }) => {
    try {
      return await usersService.remove(id, { signal, token: getState().auth.token });
    } catch (error) {
      return rejectWithValue(toApiError(error));
    }
  },
);
