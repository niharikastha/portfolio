"use client";

import { useEffect, useState } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { nav, profile } from "@/content/site";

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 220, damping: 40, restDelta: 0.001 });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the mobile sheet on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled
          ? "border-b border-ink-700/80 bg-ink-950/80 backdrop-blur-xl"
          : "border-b border-transparent"
      }`}
    >
      <nav aria-label="Main" className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <a
          href="#main"
          className="font-mono text-[13px] font-medium uppercase tracking-[0.18em] text-paper"
        >
          {profile.name.split(" ")[0]}
          <span className="text-gold-400">.</span>
        </a>

        <ul className="hidden items-center gap-8 md:flex">
          {nav.map((item) => (
            <li key={item.href}>
              <a
                href={item.href}
                className="link-underline font-mono text-xs uppercase tracking-[0.14em] text-paper-dim transition-colors duration-300 hover:text-paper"
              >
                {item.label}
              </a>
            </li>
          ))}
          <li>
            <a
              href={profile.resumePath}
              download
              className="rounded-full bg-gold-400 px-4 py-2 font-mono text-xs font-semibold uppercase tracking-[0.12em] text-ink-950 transition-transform duration-300 hover:scale-[1.04] hover:bg-gold-300"
            >
              Resume
            </a>
          </li>
        </ul>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? "Close menu" : "Open menu"}
          className="flex h-9 w-9 flex-col items-center justify-center gap-[5px] md:hidden"
        >
          <span
            className={`h-[1.5px] w-5 bg-paper transition-transform duration-300 ${
              open ? "translate-y-[6.5px] rotate-45" : ""
            }`}
          />
          <span
            className={`h-[1.5px] w-5 bg-paper transition-opacity duration-300 ${
              open ? "opacity-0" : ""
            }`}
          />
          <span
            className={`h-[1.5px] w-5 bg-paper transition-transform duration-300 ${
              open ? "-translate-y-[6.5px] -rotate-45" : ""
            }`}
          />
        </button>
      </nav>

      {/* Mobile sheet */}
      <div
        id="mobile-nav"
        hidden={!open}
        className="border-t border-ink-700 bg-ink-950/95 backdrop-blur-xl md:hidden"
      >
        <ul className="mx-auto max-w-6xl px-6 py-4">
          {nav.map((item) => (
            <li key={item.href} className="border-b border-ink-800 last:border-0">
              <a
                href={item.href}
                onClick={() => setOpen(false)}
                className="block py-3.5 font-mono text-sm uppercase tracking-[0.14em] text-paper-dim"
              >
                {item.label}
              </a>
            </li>
          ))}
          <li className="pt-4">
            <a
              href={profile.resumePath}
              download
              onClick={() => setOpen(false)}
              className="block rounded-full bg-gold-400 py-3 text-center font-mono text-sm font-semibold uppercase tracking-[0.12em] text-ink-950"
            >
              Download Resume
            </a>
          </li>
        </ul>
      </div>

      {/* Reading progress */}
      <motion.div
        style={{ scaleX: progress }}
        className="h-[2px] origin-left bg-gradient-to-r from-gold-500 via-gold-400 to-sky-soft"
      />
    </header>
  );
}
