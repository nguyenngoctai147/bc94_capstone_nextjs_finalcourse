import { bookingEndpoints } from "@/config/endpoints";
import { createCrudService } from "@/lib/api/crud-service";
import { api } from "@/lib/api/http";
import { toPage } from "@/lib/api/response";
import type { RequestOptions } from "@/lib/api/types";
import type { Booking, CreateBooking, UpdateBooking } from "./bookings.types";
export const bookingsService = {
  ...createCrudService<Booking, CreateBooking, UpdateBooking>(bookingEndpoints.base),

  list: async (options?: RequestOptions) => {
    const candidate = options?.params?.maNguoiDung;
    const id = typeof candidate === "string" || typeof candidate === "number" ? candidate : undefined;
    return toPage(await api.get<Booking[]>(id ? bookingEndpoints.byUser(id) : bookingEndpoints.base, options));
  },
  byUser: (id: number, options?: RequestOptions) => api.get<Booking[]>(bookingEndpoints.byUser(id), options),
};
