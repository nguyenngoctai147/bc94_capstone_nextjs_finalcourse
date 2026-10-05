import type { AuthSession } from "./auth.types";
import type { User } from "@/features/users/users.types";

export const AUTH_STORAGE_KEY = "hotux.auth.session.v1";

type StoredSession = {
  version: 1;
  token: string;
  user: User;
};

export function toSafeUser(value: unknown): User | null {
  if (!value || typeof value !== "object") return null;
  const record = value as Record<string, unknown>;
  const id = record.id;
  if (!Number.isInteger(id) || typeof id !== "number" || typeof record.name !== "string" || typeof record.role !== "string") return null;
  return {
    id,
    name: record.name,
    email: typeof record.email === "string" ? record.email : "",
    phone: typeof record.phone === "string" ? record.phone : "",
    birthday: typeof record.birthday === "string" ? record.birthday : "",
    gender: typeof record.gender === "boolean" ? record.gender : false,
    role: record.role,
    ...(typeof record.avatar === "string" && record.avatar ? { avatar: record.avatar } : {}),
  };
}

export function toStoredSession(user: User | null, token: string | null): StoredSession | null {
  const safeUser = toSafeUser(user);
  if (!safeUser || typeof token !== "string" || !token) return null;
  return { version: 1, user: safeUser, token };
}

export function parseStoredSession(serialized: string | null): AuthSession | null {
  if (!serialized) return null;
  try {
    const parsed = JSON.parse(serialized) as Partial<StoredSession>;
    if (parsed.version !== 1 || typeof parsed.token !== "string" || !parsed.token) return null;
    const user = toSafeUser(parsed.user);
    return user ? { user, token: parsed.token } : null;
  } catch {
    return null;
  }
}

export function readStoredSession(storage: Pick<Storage, "getItem">): AuthSession | null {
  return parseStoredSession(storage.getItem(AUTH_STORAGE_KEY));
}

export function writeStoredSession(
  storage: Pick<Storage, "setItem" | "removeItem">,
  user: User | null,
  token: string | null,
) {
  const session = toStoredSession(user, token);
  if (session) storage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
  else storage.removeItem(AUTH_STORAGE_KEY);
}
