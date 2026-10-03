"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

import { track } from "@/lib/analytics/client";

/** Sends a pageview on first load and on every client-side navigation. */
export default function Analytics() {
  const pathname = usePathname();

  useEffect(() => {
    track("pageview");
  }, [pathname]);

  return null;
}
