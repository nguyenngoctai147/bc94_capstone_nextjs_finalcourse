"use client";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { Provider } from "react-redux";
import { makeStore } from "@/store";
import { hydrateSession } from "@/features/auth/auth.slice";
import { AUTH_STORAGE_KEY, readStoredSession, writeStoredSession } from "@/features/auth/auth.session";
export function StoreProvider({ children }: { children: ReactNode }) {
  const [store] = useState(makeStore);
  const syncingFromStorage = useRef(false);
  useEffect(() => {
    try {
      store.dispatch(hydrateSession(readStoredSession(window.localStorage)));
      const unsubscribe = store.subscribe(() => {
        const { user, token, hydrated } = store.getState().auth;
        if (!hydrated || syncingFromStorage.current) return;
        try { writeStoredSession(window.localStorage, user, token); } catch { /* Storage may be disabled. */ }
      });
      const syncSession = (event: StorageEvent) => {
        if (event.key !== AUTH_STORAGE_KEY) return;
        try {
          syncingFromStorage.current = true;
          store.dispatch(hydrateSession(readStoredSession(window.localStorage)));
        } finally {
          syncingFromStorage.current = false;
        }
      };
      window.addEventListener("storage", syncSession);
      return () => { unsubscribe(); window.removeEventListener("storage", syncSession); };
    } catch {
      // Private-mode/storage failures should never block a session in memory.
      store.dispatch(hydrateSession(null));
    }
  }, [store]);
  return <Provider store={store}>{children}</Provider>;
}
