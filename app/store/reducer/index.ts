import { combineReducers, type UnknownAction } from "@reduxjs/toolkit";
import { logout } from "@/store/slice/auth";
import authReducer from "./auth";
import bookingsReducer from "./bookings";
import locationsReducer from "./location";
import { locationRoomsReducer, roomsReducer } from "./room";
import reviewsReducer from "./reviews";
import usersReducer from "./user";

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

export const rootReducer = (
  state: RootState | undefined,
  action: UnknownAction,
): RootState => {
  if (!state || !logout.match(action)) return combinedReducer(state, action);

  const resetState = combinedReducer(undefined, action);
  return {
    ...resetState,
    rooms: state.rooms,
    locationRooms: state.locationRooms,
    locations: state.locations,
  };
};

export default rootReducer;
