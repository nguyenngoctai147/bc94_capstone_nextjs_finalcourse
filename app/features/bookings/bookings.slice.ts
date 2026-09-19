import { createCrudSlice } from "@/store/crud";
import { bookingsThunks } from "./bookings.thunks";
const bookingsSlice = createCrudSlice("bookings", bookingsThunks);
export const bookingsActions = bookingsSlice.actions;
export default bookingsSlice.reducer;
