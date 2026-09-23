"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

/**
 * The handwritten end of the headline. Each phrase blurs in, gets underlined
 * in pen, and gives way to the next. With reduced motion it stays on the first.
 */
export function RotatingPhrase({ phrases }: { phrases: string[] }) {
  const reduced = useReducedMotion();
  const [i, setI] = useState(0);

  useEffect(() => {
    if (reduced || phrases.length < 2) return;
    const t = setInterval(() => setI((n) => (n + 1) % phrases.length), 2600);
    return () => clearInterval(t);
  }, [reduced, phrases.length]);

  const phrase = phrases[i] ?? "";

  return (
    <span className="relative inline-block min-h-[1.15em] align-bottom">
      {/* Screen readers get the full list once, not a live-changing word. */}
      <span className="sr-only">{phrases.join(", ")}</span>
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={phrase}
          aria-hidden
          className="relative inline-block whitespace-nowrap font-hand font-bold text-pen"
          initial={reduced ? false : { opacity: 0, filter: "blur(10px)", y: 8 }}
          animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
          exit={reduced ? undefined : { opacity: 0, filter: "blur(8px)", y: -6 }}
          transition={{ duration: 0.45, ease: [0.2, 0.7, 0.2, 1] }}
        >
          {phrase}
          <svg
            viewBox="0 0 200 14"
            preserveAspectRatio="none"
            className="absolute -bottom-1 left-0 h-3 w-full"
            fill="none"
          >
            <motion.path
              d="M3 9c38-6 84-8 128-5 22 1.5 44 3 66 1"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              initial={reduced ? false : { pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ delay: 0.3, duration: 0.6, ease: "easeOut" }}
            />
          </svg>
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
