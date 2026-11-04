"use client";

import type { ReactNode } from "react";
import { Provider } from "react-redux";
import { useAppStore, useSessionStorageSync } from "./hooks";

type ReduxProvidersProps = Readonly<{
  children: ReactNode;
}>;

export default function ReduxProviders({ children }: ReduxProvidersProps) {
  const store = useAppStore();

  useSessionStorageSync(store);

  return <Provider store={store}>{children}</Provider>;
}
