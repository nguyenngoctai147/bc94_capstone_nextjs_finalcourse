"use client";

import { useEffect, useRef } from "react";
import type { AppStore } from "@/store";
import { hydrateSession } from "@/store/slice/auth";
import {
  AUTH_STORAGE_KEY,
  readStoredSession,
  writeStoredSession,
} from "../localStorage";

export const useSessionStorageSync = (store: AppStore) => {
  const syncingFromStorage = useRef(false);

  useEffect(() => {
    let unsubscribe: () => void = () => {};
    let isListening = false;

    const handleStorage = (event: StorageEvent) => {
      if (event.key !== AUTH_STORAGE_KEY) return;

      try {
        syncingFromStorage.current = true;
        store.dispatch(hydrateSession(readStoredSession(window.localStorage)));
      } catch {
        store.dispatch(hydrateSession(null));
      } finally {
        syncingFromStorage.current = false;
      }
    };

    try {
      store.dispatch(hydrateSession(readStoredSession(window.localStorage)));

      unsubscribe = store.subscribe(() => {
        const { user, token, hydrated } = store.getState().auth;

        if (!hydrated || syncingFromStorage.current) return;

        try {
          writeStoredSession(window.localStorage, user, token);
        } catch {}
      });

      window.addEventListener("storage", handleStorage);
      isListening = true;
    } catch {
      store.dispatch(hydrateSession(null));
    }

    return () => {
      unsubscribe();

      if (isListening) {
        window.removeEventListener("storage", handleStorage);
      }
    };
  }, [store]);
};
