import { nextApi } from "@/route/next.api";
import { api } from "@/services/http";
import type { RequestOptions } from "@/types/api";
import type { AuthSession, LoginInput, RegisterInput } from "@/store/type/auth";
import type { User } from "@/store/type/user";

export const authService = {
  login: async (data: LoginInput, options?: RequestOptions) => {
    const session = await api.post<AuthSession>(nextApi.auth.signin, data, options);
    if (!session || typeof session.token !== "string" || !session.token || !session.user || typeof session.user.id !== "number" || typeof session.user.role !== "string") {
      throw { status: 502, message: "Response đăng nhập không đúng định dạng user/token." };
    }
    return session;
  },
  register: (data: RegisterInput, options?: RequestOptions) =>
    api.post<User>(
      nextApi.auth.signup,
      { id: 0, ...data, role: "USER" },
      options,
    ),
};
