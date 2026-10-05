import assert from "node:assert/strict";
import test from "node:test";
import { AUTH_STORAGE_KEY, parseStoredSession, toStoredSession, writeStoredSession } from "../app/features/auth/auth.session";
import { hydrateSession, logout } from "../app/features/auth/auth.slice";
import { makeStore } from "../app/store";

test("persisted auth session excludes password and invalid stored data is ignored", () => {
  const session = toStoredSession({ id: 1, name: "Guest", email: "guest@example.com", phone: "", birthday: "", gender: false, role: "USER" }, "token");
  assert.deepEqual(parseStoredSession(JSON.stringify({ ...session, password: "never" })), { user: session!.user, token: "token" });
  assert.equal(parseStoredSession('{bad json'), null);
  assert.equal(parseStoredSession(JSON.stringify({ version: 1, token: "", user: session!.user })), null);
});

test("session storage removes data on logout", () => {
  const values = new Map<string, string>();
  const storage = { setItem: (key: string, value: string) => values.set(key, value), removeItem: (key: string) => values.delete(key) };
  writeStoredSession(storage, null, null);
  assert.equal(values.has(AUTH_STORAGE_KEY), false);
});

test("hydrating restores only a valid session and logout clears it", () => {
  const store = makeStore();
  store.dispatch(hydrateSession({ token: "token", user: { id: 2, name: "Mai", email: "mai@example.com", phone: "", birthday: "", gender: false, role: "USER" } }));
  assert.equal(store.getState().auth.user?.name, "Mai");
  assert.equal(store.getState().auth.hydrated, true);
  store.dispatch(logout());
  assert.equal(store.getState().auth.token, null);
  assert.equal(store.getState().auth.hydrated, true);
});
