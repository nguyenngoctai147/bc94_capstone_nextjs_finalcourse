import { createCrudThunks } from "@/store/crud";
import { roomsService } from "./rooms.service";
export const roomsThunks = createCrudThunks("rooms", roomsService);
