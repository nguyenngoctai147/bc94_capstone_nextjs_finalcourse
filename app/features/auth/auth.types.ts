import type { CreateUser, User } from "@/features/users/users.types";
export type LoginInput = { email: string; password: string };
export type RegisterInput = Omit<CreateUser, "role">;
export type AuthSession = { user: User; token: string };
