import { createRequestThunk } from "@/store/create-api-thunk";
import { authService } from "./auth.service";
export const login = createRequestThunk("auth/login", authService.login);
export const register = createRequestThunk("auth/register", authService.register);
