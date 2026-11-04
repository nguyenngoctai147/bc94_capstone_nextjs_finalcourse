"use client";

import { useState } from "react";
import { makeStore } from "@/store";

export const useAppStore = () => {
  const [store] = useState(makeStore);

  return store;
};
