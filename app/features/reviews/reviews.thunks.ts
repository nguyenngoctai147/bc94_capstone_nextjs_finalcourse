import { createCrudThunks } from "@/store/crud";
import { reviewsService } from "./reviews.service";
export const reviewsThunks = createCrudThunks("reviews", reviewsService);
