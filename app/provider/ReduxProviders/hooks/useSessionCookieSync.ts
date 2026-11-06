"use client";

import { useEffect } from "react";
import type { AppStore } from "@/store";
import { hydrateSession, logout } from "@/store/slice/auth";
import {
  LEGACY_AUTH_STORAGE_KEYS,
  clearSessionCookie,
  createSessionCookie,
  getSessionCookieExpiry,
  readSessionCookie,
} from "../sessionCookie";

const MAX_TIMEOUT_MS = 2_147_483_647;

export const useSessionCookieSync = (store: AppStore) => {
  useEffect(() => {
    let expiryTimer: number | undefined;
    let syncedToken: string | null = null;
    let unsubscribe = () => {};

    const clearExpiryTimer = () => {
      if (expiryTimer !== undefined) window.clearTimeout(expiryTimer);
      expiryTimer = undefined;
    };

    const scheduleExpiry = () => {
      clearExpiryTimer();

      const expiresAt = getSessionCookieExpiry(document.cookie);
      if (!expiresAt) return;

      const delay = Math.min(Math.max(expiresAt - Date.now(), 0), MAX_TIMEOUT_MS);
      expiryTimer = window.setTimeout(() => {
        if (readSessionCookie(document.cookie)) {
          scheduleExpiry();
          return;
        }

        document.cookie = clearSessionCookie();
        store.dispatch(logout());
      }, delay);
    };

    const syncFromCookie = () => {
      const session = readSessionCookie(document.cookie);
      const stateToken = store.getState().auth.token;

      if (session?.token === stateToken) {
        scheduleExpiry();
        return;
      }

      syncedToken = session?.token ?? null;
      store.dispatch(hydrateSession(session));
      scheduleExpiry();
    };

    try {
      LEGACY_AUTH_STORAGE_KEYS.forEach((key) => {
        window.localStorage.removeItem(key);
        window.sessionStorage.removeItem(key);
      });

      const session = readSessionCookie(document.cookie);
      syncedToken = session?.token ?? null;
      store.dispatch(hydrateSession(session));

      if (!session) document.cookie = clearSessionCookie();
      scheduleExpiry();

      unsubscribe = store.subscribe(() => {
        const { user, token, hydrated } = store.getState().auth;
        if (!hydrated) return;

        if (!user || !token) {
          syncedToken = null;
          document.cookie = clearSessionCookie();
          scheduleExpiry();
          return;
        }

        const cookieSession = readSessionCookie(document.cookie);
        const isNewLogin = token !== syncedToken;

        if (!isNewLogin && cookieSession?.token !== token) {
          syncedToken = null;
          store.dispatch(logout());
          return;
        }

        document.cookie = createSessionCookie(
          user,
          token,
          document.cookie,
          Date.now(),
          window.location.protocol === "https:",
        );
        syncedToken = token;
        scheduleExpiry();
      });

      window.addEventListener("focus", syncFromCookie);
      document.addEventListener("visibilitychange", syncFromCookie);
    } catch {
      store.dispatch(hydrateSession(null));
    }

    return () => {
      clearExpiryTimer();
      unsubscribe();
      window.removeEventListener("focus", syncFromCookie);
      document.removeEventListener("visibilitychange", syncFromCookie);
    };
  }, [store]);
};
