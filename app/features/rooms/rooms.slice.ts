import { createCrudSlice } from "@/store/crud";
import { roomsThunks } from "./rooms.thunks";
const roomsSlice = createCrudSlice("rooms", roomsThunks);
export const roomsActions = roomsSlice.actions;
export default roomsSlice.reducer;
