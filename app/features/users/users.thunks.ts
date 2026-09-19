import { createCrudThunks } from "@/store/crud";
import { usersService } from "./users.service";
export const usersThunks = createCrudThunks("users", usersService);
