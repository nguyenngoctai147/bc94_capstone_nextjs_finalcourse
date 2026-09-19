import { createCrudThunks } from "@/store/crud";
import { locationsService } from "./locations.service";
export const locationsThunks = createCrudThunks("locations", locationsService);
