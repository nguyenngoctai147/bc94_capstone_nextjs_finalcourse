import { combineReducers, configureStore, type UnknownAction } from "@reduxjs/toolkit";
import authReducer, { logout } from "@/features/auth/auth.slice";
import roomsReducer from "@/features/rooms/rooms.slice";
import locationRoomsReducer from "@/features/rooms/location-rooms.slice";
import bookingsReducer from "@/features/bookings/bookings.slice";
import locationsReducer from "@/features/locations/locations.slice";
import usersReducer from "@/features/users/users.slice";
import reviewsReducer from "@/features/reviews/reviews.slice";

// Đăng ký reducer của từng feature, giống store/index.js trong bài React.
const combinedReducer = combineReducers({
  auth: authReducer,
  rooms: roomsReducer,
  locationRooms: locationRoomsReducer,
  bookings: bookingsReducer,
  locations: locationsReducer,
  users: usersReducer,
  reviews: reviewsReducer,
});

export type RootState = ReturnType<typeof combinedReducer>;

function rootReducer(state: RootState | undefined, action: UnknownAction) {
  if (!state || !logout.match(action)) return combinedReducer(state, action);

  // Rooms and locations are public catalogue data. Keeping them during logout
  // avoids both needless refetching and replacing React children while legacy
  // Slick/NiceSelect widgets still own their transformed DOM. Private/auth
  // state is rebuilt from the reducers' initial state below.
  const resetState = combinedReducer(undefined, action);
  return {
    ...resetState,
    rooms: state.rooms,
    locationRooms: state.locationRooms,
    locations: state.locations,
  };
}
// Next.js tạo store theo Provider, tránh dùng chung dữ liệu giữa các lần render server.
export const makeStore = () => {
  return configureStore({
    reducer: rootReducer,
    // Metadata của action đăng nhập có mật khẩu; không ghi vào Redux DevTools.
    devTools: false,
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type AppDispatch = AppStore["dispatch"];
