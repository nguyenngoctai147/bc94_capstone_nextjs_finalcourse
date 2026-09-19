import { createCrudSlice } from "@/store/crud";
import { reviewsThunks } from "./reviews.thunks";
const reviewsSlice = createCrudSlice("reviews", reviewsThunks);
export const reviewsActions = reviewsSlice.actions;
export default reviewsSlice.reducer;
