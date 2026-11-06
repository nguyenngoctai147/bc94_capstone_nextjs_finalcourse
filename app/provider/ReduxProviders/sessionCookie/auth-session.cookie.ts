import type { AuthSession } from "@/store/type/auth";
import type { User } from "@/store/type/user";

export const AUTH_COOKIE_KEY = "hotux.auth.session.v3";
export const LEGACY_AUTH_STORAGE_KEYS = [
  "hotux.auth.session.v1",
  "hotux.auth.session.v2",
] as const;
export const AUTH_SESSION_MAX_AGE_MS = 30 * 24 * 60 * 60 * 1000;

type StoredSession = {
  version: 3;
  token: string;
  user: User;
  createdAt: number;
  expiresAt: number;
};

export const toSafeUser = (value: unknown): User | null => {
  if (!value || typeof value !== "object") return null;

  const record = value as Record<string, unknown>;
  const { id, name, role } = record;

  if (!Number.isInteger(id) || typeof id !== "number") return null;
  if (typeof name !== "string" || typeof role !== "string") return null;

  return {
    id,
    name,
    email: typeof record.email === "string" ? record.email : "",
    phone: typeof record.phone === "string" ? record.phone : "",
    birthday: typeof record.birthday === "string" ? record.birthday : "",
    gender: typeof record.gender === "boolean" ? record.gender : false,
    role,
    ...(typeof record.avatar === "string" && record.avatar
      ? { avatar: record.avatar }
      : {}),
  };
};

export const toStoredSession = (
  user: User | null,
  token: string | null,
  now = Date.now(),
): StoredSession | null => {
  const safeUser = toSafeUser(user);

  if (!safeUser || typeof token !== "string" || !token) return null;

  return {
    version: 3,
    user: safeUser,
    token,
    createdAt: now,
    expiresAt: now + AUTH_SESSION_MAX_AGE_MS,
  };
};

const parseStoredSessionRecord = (
  serialized: string | null,
  now = Date.now(),
): StoredSession | null => {
  if (!serialized) return null;

  try {
    const parsed = JSON.parse(serialized) as Partial<StoredSession>;
    const createdAt = Number(parsed.createdAt);
    const expiresAt = Number(parsed.expiresAt);
    const hasValidLifetime =
      Number.isFinite(createdAt) &&
      Number.isFinite(expiresAt) &&
      createdAt <= now &&
      expiresAt - createdAt === AUTH_SESSION_MAX_AGE_MS &&
      now < expiresAt;

    if (
      parsed.version !== 3 ||
      typeof parsed.token !== "string" ||
      !parsed.token ||
      !hasValidLifetime
    ) {
      return null;
    }

    const user = toSafeUser(parsed.user);

    return user
      ? { version: 3, token: parsed.token, user, createdAt, expiresAt }
      : null;
  } catch {
    return null;
  }
};

const readCookieValue = (cookieHeader: string, name: string) => {
  const prefix = `${name}=`;
  const cookie = cookieHeader
    .split(";")
    .map((value) => value.trim())
    .find((value) => value.startsWith(prefix));

  if (!cookie) return null;

  try {
    return decodeURIComponent(cookie.slice(prefix.length));
  } catch {
    return null;
  }
};

export const parseStoredSession = (
  serialized: string | null,
  now = Date.now(),
): AuthSession | null => {
  const session = parseStoredSessionRecord(serialized, now);
  return session ? { user: session.user, token: session.token } : null;
};

export const readSessionCookie = (
  cookieHeader: string,
  now = Date.now(),
): AuthSession | null =>
  parseStoredSession(readCookieValue(cookieHeader, AUTH_COOKIE_KEY), now);

export const getSessionCookieExpiry = (
  cookieHeader: string,
  now = Date.now(),
) =>
  parseStoredSessionRecord(
    readCookieValue(cookieHeader, AUTH_COOKIE_KEY),
    now,
  )?.expiresAt ?? null;

export const clearSessionCookie = () =>
  `${AUTH_COOKIE_KEY}=; Path=/; SameSite=Lax; Max-Age=0`;

export const createSessionCookie = (
  user: User | null,
  token: string | null,
  currentCookies = "",
  now = Date.now(),
  secure = false,
) => {
  const session = toStoredSession(user, token, now);

  if (!session) return clearSessionCookie();

  const current = parseStoredSessionRecord(
    readCookieValue(currentCookies, AUTH_COOKIE_KEY),
    now,
  );

  if (current?.token === session.token) {
    session.createdAt = current.createdAt;
    session.expiresAt = current.expiresAt;
  }

  const value = encodeURIComponent(JSON.stringify(session));
  const secureAttribute = secure ? "; Secure" : "";

  return `${AUTH_COOKIE_KEY}=${value}; Path=/; SameSite=Lax${secureAttribute}`;
};
