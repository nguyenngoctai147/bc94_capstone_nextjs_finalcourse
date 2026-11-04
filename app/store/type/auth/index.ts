import type { CreateUser, User } from "@/store/type/user";
import type { RequestState } from "@/store/type/request";

export type LoginInput = { email: string; password: string };
export type RegisterInput = Omit<CreateUser, "role">;
export type AuthSession = { user: User; token: string };

export type AuthState = {
  user: User | null;
  token: string | null;
  login: RequestState;
  register: RequestState;
  hydrated: boolean;
};
