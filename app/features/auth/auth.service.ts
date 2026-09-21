import { authEndpoints } from "@/config/endpoints";
import { api } from "@/lib/api/http";
import type { RequestOptions } from "@/lib/api/types";
import type { AuthSession, LoginInput, RegisterInput } from "./auth.types";
import type { User } from "@/features/users/users.types";

export const authService = {
  login: async (data: LoginInput, options?: RequestOptions) => {
    const session = await api.post<AuthSession>(authEndpoints.login, data, options);
    if (!session || typeof session.token !== "string" || !session.token || !session.user || typeof session.user.id !== "number" || typeof session.user.role !== "string") {
      throw { status: 502, message: "Response đăng nhập không đúng định dạng user/token." };
    }
    return session;
  },
  register: (data: RegisterInput, options?: RequestOptions) =>
    api.post<User>(
      authEndpoints.register,
      { id: 0, ...data, role: "USER" },
      options,
    ),
};
