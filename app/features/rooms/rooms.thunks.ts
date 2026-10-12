import { createCrudThunks } from "@/store/crud";
import { createRequestThunk } from "@/store/create-api-thunk";
import { roomsService } from "./rooms.service";
export const roomsThunks = {
  ...createCrudThunks("rooms", roomsService),
  byLocation: createRequestThunk("rooms/byLocation", roomsService.byLocation),
};
