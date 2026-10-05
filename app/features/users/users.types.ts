export type User = {
  id: number; name: string; email: string; phone: string | null; birthday: string;
  gender: boolean; role: string; avatar?: string | null;
};
export type CreateUser = Omit<User, "id" | "avatar"> & { password: string };
export type UpdateUser = Omit<User, "id" | "avatar">;
