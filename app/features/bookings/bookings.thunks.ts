import { createCrudThunks } from "@/store/crud";
import { bookingsService } from "./bookings.service";
export const bookingsThunks = createCrudThunks("bookings", bookingsService);
