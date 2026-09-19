import { createCrudSlice } from "@/store/crud";
import { locationsThunks } from "./locations.thunks";
const locationsSlice = createCrudSlice("locations", locationsThunks);
export const locationsActions = locationsSlice.actions;
export default locationsSlice.reducer;
