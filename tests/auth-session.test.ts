import assert from "node:assert/strict";
import test from "node:test";
import {
  AUTH_COOKIE_KEY,
  AUTH_SESSION_MAX_AGE_MS,
  clearSessionCookie,
  createSessionCookie,
  getSessionCookieExpiry,
  parseStoredSession,
  readSessionCookie,
  toStoredSession,
} from "../app/features/auth/auth.session";
import { hydrateSession, logout } from "../app/store/slice/auth";
import { makeStore } from "../app/store";

const user = {
  id: 3,
  name: "An",
  email: "an@example.com",
  phone: "",
  birthday: "",
  gender: false,
  role: "USER",
};

test("persisted auth session excludes password and invalid data is ignored", () => {
  const now = Date.UTC(2026, 10, 6);
  const session = toStoredSession(user, "token", now);

  assert.equal(session!.expiresAt, now + AUTH_SESSION_MAX_AGE_MS);
  assert.deepEqual(
    parseStoredSession(JSON.stringify({ ...session, password: "never" }), now),
    { user: session!.user, token: "token" },
  );
  assert.equal(parseStoredSession(JSON.stringify(session), session!.expiresAt), null);
  assert.equal(parseStoredSession("{bad json"), null);
  assert.equal(
    parseStoredSession(JSON.stringify({ ...session, version: 2 }), now),
    null,
  );
});

test("auth uses a browser-session cookie without a persistent expiry attribute", () => {
  const now = Date.UTC(2026, 10, 6);
  const cookie = createSessionCookie(user, "token", "", now);

  assert.match(cookie, new RegExp(`^${AUTH_COOKIE_KEY}=`));
  assert.doesNotMatch(cookie, /(?:Expires|Max-Age)=/i);
  assert.deepEqual(readSessionCookie(cookie, now), { user, token: "token" });
  assert.equal(
    getSessionCookieExpiry(cookie, now),
    now + AUTH_SESSION_MAX_AGE_MS,
  );
});

test("clearing auth expires the browser-session cookie immediately", () => {
  assert.match(clearSessionCookie(), /Max-Age=0/);
});

test("rewriting the same login does not extend its 30 day lifetime", () => {
  const now = Date.UTC(2026, 10, 6);
  const firstCookie = createSessionCookie(user, "token", "", now);
  const nextCookie = createSessionCookie(
    user,
    "token",
    firstCookie,
    now + 24 * 60 * 60 * 1000,
  );

  assert.equal(
    getSessionCookieExpiry(nextCookie, now + 24 * 60 * 60 * 1000),
    now + AUTH_SESSION_MAX_AGE_MS,
  );
});

test("hydrating restores only a valid session and logout clears it", () => {
  const store = makeStore();
  store.dispatch(hydrateSession({ token: "token", user }));
  assert.equal(store.getState().auth.user?.name, "An");
  assert.equal(store.getState().auth.hydrated, true);
  store.dispatch(logout());
  assert.equal(store.getState().auth.token, null);
  assert.equal(store.getState().auth.hydrated, true);
});
