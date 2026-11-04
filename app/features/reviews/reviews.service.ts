import { nextApi } from "@/route/next.api";
import { createCrudService } from "@/services/crud";
import { api } from "@/services/http";
import type { RequestOptions } from "@/types/api";
import type { Review, CreateReview, UpdateReview, RoomReview } from "@/store/type/reviews";
export const reviewsService = {
  ...createCrudService<Review, CreateReview, UpdateReview>(nextApi.reviews.base, { detail: false }),

  byRoom: (id: number, options?: RequestOptions) => api.get<RoomReview[]>(nextApi.reviews.byRoom(id), options),
};
