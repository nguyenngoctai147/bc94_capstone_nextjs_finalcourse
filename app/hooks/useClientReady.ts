"use client";

import { useSyncExternalStore } from "react";

const subscribe = () => () => undefined;

/**
 * False for SSR and the first hydration pass, true once React owns the client tree.
 * This keeps browser-only persisted state from changing the initial HTML shape.
 */
export function useClientReady() {
  return useSyncExternalStore(subscribe, () => true, () => false);
}
