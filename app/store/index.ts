import { combineReducers, configureStore, type UnknownAction } from "@reduxjs/toolkit";
import authReducer, { logout } from "@/features/auth/auth.slice";
import roomsReducer from "@/features/rooms/rooms.slice";
import locationRoomsReducer from "@/features/rooms/location-rooms.slice";
import bookingsReducer from "@/features/bookings/bookings.slice";
import locationsReducer from "@/features/locations/locations.slice";
import usersReducer from "@/features/users/users.slice";
import reviewsReducer from "@/features/reviews/reviews.slice";

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

  const resetState = combinedReducer(undefined, action);
  return {
    ...resetState,
    rooms: state.rooms,
    locationRooms: state.locationRooms,
    locations: state.locations,
  };
}
export const makeStore = () => {
  return configureStore({
    reducer: rootReducer,
    devTools: false,
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type AppDispatch = AppStore["dispatch"];
