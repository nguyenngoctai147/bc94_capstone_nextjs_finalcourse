export type User = {
  id: number; name: string; email: string; phone: string; birthday: string;
  gender: boolean; role: string; avatar?: string;
};
export type CreateUser = Omit<User, "id" | "avatar"> & { password: string };
export type UpdateUser = Omit<User, "id" | "avatar">;
