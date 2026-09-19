import { combineReducers, configureStore, type UnknownAction } from "@reduxjs/toolkit";
import auth, { logout } from "@/features/auth/auth.slice";
import rooms from "@/features/rooms/rooms.slice";
import bookings from "@/features/bookings/bookings.slice";
import locations from "@/features/locations/locations.slice";
import users from "@/features/users/users.slice";
import reviews from "@/features/reviews/reviews.slice";
const combinedReducer = combineReducers({ auth, rooms, bookings, locations, users, reviews });
export type RootState = ReturnType<typeof combinedReducer>;
function rootReducer(state: RootState | undefined, action: UnknownAction) {
  return combinedReducer(logout.match(action) ? undefined : state, action);
}
export const makeStore = () => configureStore({
  reducer: rootReducer,
  // Auth action metadata contains credentials; keep Redux DevTools off by default.
  devTools: false,
});
export type AppStore = ReturnType<typeof makeStore>;
export type AppDispatch = AppStore["dispatch"];
