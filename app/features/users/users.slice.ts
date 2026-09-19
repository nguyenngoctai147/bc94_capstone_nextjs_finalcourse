import { createCrudSlice } from "@/store/crud";
import { usersThunks } from "./users.thunks";
const usersSlice = createCrudSlice("users", usersThunks);
export const usersActions = usersSlice.actions;
export default usersSlice.reducer;
