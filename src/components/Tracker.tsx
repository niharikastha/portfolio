"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

/**
 * Fires POST /api/track once per pathname change. Uses a per-visitor session
 * id kept in localStorage so return visits can be grouped. Never blocks or
 * throws — analytics failure must not touch the UX.
 */
export function Tracker() {
  const pathname = usePathname();
  const last = useRef<string | null>(null);

  useEffect(() => {
    if (last.current === pathname) return;
    last.current = pathname;

    let sessionId = "";
    try {
      sessionId = localStorage.getItem("visitor-id") ?? "";
      if (!sessionId) {
        sessionId = crypto.randomUUID();
        localStorage.setItem("visitor-id", sessionId);
      }
    } catch {
      // Storage may be blocked; that's fine, we just won't group this session.
    }

    fetch("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        path: pathname,
        referrer: document.referrer || null,
        sessionId,
      }),
      keepalive: true,
    }).catch(() => {});
  }, [pathname]);

  return null;
}
