import { createSlice } from "@reduxjs/toolkit";
import {
  createResourceState,
  failRequest,
  finishRequest,
  startRequest,
} from "@/store/request-state";
import {
  createUser,
  deleteUser,
  fetchUserDetail,
  fetchUsers,
  patchUser,
  updateUser,
} from "@/store/thunk/user";
import type { User } from "@/store/type/user";
import type { ResourceState } from "@/store/type/request";

const initialState: ResourceState<User> = createResourceState<User>();

export const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    reset: () => createResourceState<User>(),
  },
  extraReducers: (builder) => {
    builder.addCase(fetchUsers.pending, (state, action) => {
      startRequest(state.requests.list, action.meta.requestId);
    });
    builder.addCase(fetchUsers.fulfilled, (state, action) => {
      if (!finishRequest(state.requests.list, action.meta.requestId)) return;

      state.items = action.payload.data;
      state.total = action.payload.totalRow;
      state.pageIndex = action.payload.pageIndex;
      state.pageSize = action.payload.pageSize;
      state.invalidated = false;
    });
    builder.addCase(fetchUsers.rejected, (state, action) => {
      failRequest(state.requests.list, action);
    });

    builder.addCase(fetchUserDetail.pending, (state, action) => {
      startRequest(state.requests.detail, action.meta.requestId);
      state.selected = null;
    });
    builder.addCase(fetchUserDetail.fulfilled, (state, action) => {
      if (!finishRequest(state.requests.detail, action.meta.requestId)) return;

      state.selected = action.payload;
    });
    builder.addCase(fetchUserDetail.rejected, (state, action) => {
      failRequest(state.requests.detail, action);
    });

    builder.addCase(createUser.pending, (state, action) => {
      startRequest(state.requests.create, action.meta.requestId);
    });
    builder.addCase(createUser.fulfilled, (state, action) => {
      if (!finishRequest(state.requests.create, action.meta.requestId)) return;

      state.invalidated = true;
    });
    builder.addCase(createUser.rejected, (state, action) => {
      failRequest(state.requests.create, action);
    });

    builder.addCase(updateUser.pending, (state, action) => {
      startRequest(state.requests.update, action.meta.requestId);
    });
    builder.addCase(updateUser.fulfilled, (state, action) => {
      if (!finishRequest(state.requests.update, action.meta.requestId)) return;

      state.invalidated = true;
    });
    builder.addCase(updateUser.rejected, (state, action) => {
      failRequest(state.requests.update, action);
    });

    builder.addCase(patchUser.pending, (state, action) => {
      startRequest(state.requests.patch, action.meta.requestId);
    });
    builder.addCase(patchUser.fulfilled, (state, action) => {
      if (!finishRequest(state.requests.patch, action.meta.requestId)) return;

      state.invalidated = true;
    });
    builder.addCase(patchUser.rejected, (state, action) => {
      failRequest(state.requests.patch, action);
    });

    builder.addCase(deleteUser.pending, (state, action) => {
      startRequest(state.requests.remove, action.meta.requestId);
    });
    builder.addCase(deleteUser.fulfilled, (state, action) => {
      if (!finishRequest(state.requests.remove, action.meta.requestId)) return;

      state.items = state.items.filter((item) => item.id !== action.payload);
      if (state.selected?.id === action.payload) state.selected = null;
      state.invalidated = true;
    });
    builder.addCase(deleteUser.rejected, (state, action) => {
      failRequest(state.requests.remove, action);
    });
  },
});

export const usersActions = usersSlice.actions;
export default usersSlice.reducer;
