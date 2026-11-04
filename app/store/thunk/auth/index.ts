import { createAsyncThunk } from "@reduxjs/toolkit";
import { authService } from "@/features/auth/auth.service";
import { toApiError } from "@/services/api-utils";
import type { ApiThunkConfig } from "@/store/type/request";
import type { AuthSession, LoginInput, RegisterInput } from "@/store/type/auth";
import type { User } from "@/store/type/user";

export const login = createAsyncThunk<AuthSession, LoginInput, ApiThunkConfig>(
  "auth/login",
  async (values, { getState, signal, rejectWithValue }) => {
    try {
      return await authService.login(values, {
        signal,
        token: getState().auth.token,
      });
    } catch (error) {
      return rejectWithValue(toApiError(error));
    }
  },
);

export const register = createAsyncThunk<User, RegisterInput, ApiThunkConfig>(
  "auth/register",
  async (values, { getState, signal, rejectWithValue }) => {
    try {
      return await authService.register(values, {
        signal,
        token: getState().auth.token,
      });
    } catch (error) {
      return rejectWithValue(toApiError(error));
    }
  },
);
