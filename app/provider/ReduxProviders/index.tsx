"use client";

import type { ReactNode } from "react";
import { Provider } from "react-redux";
import { useAppStore, useSessionCookieSync } from "./hooks";

type ReduxProvidersProps = Readonly<{
  children: ReactNode;
}>;

export default function ReduxProviders({ children }: ReduxProvidersProps) {
  const store = useAppStore();

  useSessionCookieSync(store);

  return <Provider store={store}>{children}</Provider>;
}
