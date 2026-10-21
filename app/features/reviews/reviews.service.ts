import { reviewEndpoints } from "@/config/endpoints";
import { createCrudService } from "@/lib/api/crud-service";
import { api } from "@/services/api";
import type { RequestOptions } from "@/lib/api/types";
import type { Review, CreateReview, UpdateReview, RoomReview } from "./reviews.types";
export const reviewsService = {
  ...createCrudService<Review, CreateReview, UpdateReview>(reviewEndpoints.base, { detail: false }),

  byRoom: (id: number, options?: RequestOptions) => api.get<RoomReview[]>(reviewEndpoints.byRoom(id), options),
};
