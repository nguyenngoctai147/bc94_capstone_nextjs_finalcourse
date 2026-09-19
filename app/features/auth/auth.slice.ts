import { createSlice } from "@reduxjs/toolkit";
import type { User } from "@/features/users/users.types";
import type { RequestState } from "@/store/crud";
import { login, register } from "./auth.thunks";
type AuthState = { user: User | null; token: string | null; login: RequestState; register: RequestState };
const initialState: AuthState = { user: null, token: null, login: { status: "idle", error: null }, register: { status: "idle", error: null } };
const authSlice = createSlice({
  name: "auth", initialState,
  reducers: { logout: () => initialState },
  extraReducers: (builder) => {
    builder.addCase(login.pending, (state, action) => { state.login = { status: "loading", error: null, requestId: action.meta.requestId }; });
    builder.addCase(login.fulfilled, (state, action) => {
      if (state.login.requestId !== action.meta.requestId) return;
      // Whitelist profile fields; never store an accidental password returned by the API.
      const { id, name, email, phone, birthday, gender, role, avatar } = action.payload.user;
      state.user = { id, name, email, phone, birthday, gender, role, avatar };
      state.token = action.payload.token;
      state.login = { status: "succeeded", error: null };
    });
    builder.addCase(login.rejected, (state, action) => {
      if (state.login.requestId !== action.meta.requestId) return;
      state.login = { status: action.meta.aborted ? "idle" : "failed", error: action.meta.aborted ? null : action.payload ?? { status: 0, message: "Đăng nhập thất bại." } };
    });
    builder.addCase(register.pending, (state, action) => { state.register = { status: "loading", error: null, requestId: action.meta.requestId }; });
    builder.addCase(register.fulfilled, (state, action) => {
      if (state.register.requestId === action.meta.requestId) state.register = { status: "succeeded", error: null };
    });
    builder.addCase(register.rejected, (state, action) => {
      if (state.register.requestId !== action.meta.requestId) return;
      state.register = { status: action.meta.aborted ? "idle" : "failed", error: action.meta.aborted ? null : action.payload ?? { status: 0, message: "Đăng ký thất bại." } };
    });
  },
});
export const { logout } = authSlice.actions;
export default authSlice.reducer;
