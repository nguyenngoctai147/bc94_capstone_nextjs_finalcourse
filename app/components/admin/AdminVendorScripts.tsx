"use client";

import { useEffect } from "react";
import { loadDashboardScripts } from "@/lib/legacy/dashboard-scripts";

export function AdminVendorScripts() {
  useEffect(() => {
    let cancelled = false;
    void loadDashboardScripts().catch((error: unknown) => {
      if (!cancelled) console.error(error);
    });
    return () => { cancelled = true; };
  }, []);
  return null;
}
