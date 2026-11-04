import { nextApi } from "@/route/next.api";
import { createCrudService } from "@/services/crud";
import { api } from "@/services/http";
import { toPage } from "@/services/api-utils";
import type { RequestOptions } from "@/types/api";
import type { Booking, CreateBooking, UpdateBooking } from "@/store/type/bookings";
export const bookingsService = {
  ...createCrudService<Booking, CreateBooking, UpdateBooking>(
    nextApi.booking.base,
  ),

  list: async (options?: RequestOptions) => {
    const candidate = options?.params?.maNguoiDung;
    const id =
      typeof candidate === "string" || typeof candidate === "number"
        ? candidate
        : undefined;
    return toPage(
      await api.get<Booking[]>(
        id ? nextApi.booking.byUser(id) : nextApi.booking.base,
        options,
      ),
    );
  },
  byUser: (id: number, options?: RequestOptions) =>
    api.get<Booking[]>(nextApi.booking.byUser(id), options),
};
