"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { nav as allNav, profile } from "@/content/site";
import { ThemeToggle } from "./ThemeToggle";

/**
 * `hide` drops links to sections that aren't rendered (e.g. an empty gallery).
 * `avatar` is the photo path, or null to show initials.
 */
export function Nav({ hide = [], avatar = null }: { hide?: string[]; avatar?: string | null }) {
  const nav = allNav.filter((item) => !hide.includes(item.href));
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 220, damping: 40, restDelta: 0.001 });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Highlight whichever section is crossing the middle of the viewport
  useEffect(() => {
    // Sections that aren't on the page just come back null and are skipped.
    const sections = allNav
      .map((item) => document.querySelector<HTMLElement>(item.href))
      .filter((el): el is HTMLElement => el !== null);
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(`#${entry.target.id}`);
        }
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    sections.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // Don't let the page scroll underneath the open mobile menu
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

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
        <a href="#main" className="group flex items-center gap-2.5 text-paper">
          <span className="relative h-9 w-9 overflow-hidden rounded-full border border-ink-600 bg-ink-850 transition-transform duration-300 group-hover:-rotate-6">
            {avatar ? (
              <Image src={avatar} alt="" fill sizes="36px" className="object-cover" />
            ) : (
              <span className="flex h-full items-center justify-center text-xs font-bold text-paper-dim">
                {profile.name
                  .split(" ")
                  .map((w) => w[0])
                  .join("")}
              </span>
            )}
          </span>
          <span className="text-[15px] font-semibold tracking-tight">{profile.name}</span>
        </a>

        <ul
          onMouseLeave={() => setHovered(null)}
          className={`hidden items-center gap-0.5 rounded-full border p-1 transition-colors duration-500 lg:flex ${
            scrolled ? "border-ink-700 bg-ink-900/70" : "border-ink-700/70 bg-ink-900/40 backdrop-blur-md"
          }`}
        >
          {nav.map((item) => {
            const lit = (hovered ?? active) === item.href;
            return (
              <li key={item.href} className="relative">
                {lit ? (
                  <motion.span
                    layoutId="nav-pill"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    className="absolute inset-0 rounded-full bg-ink-800 shadow-[inset_0_0_0_1px_var(--color-ink-600)]"
                  />
                ) : null}
                <a
                  href={item.href}
                  onMouseEnter={() => setHovered(item.href)}
                  aria-current={active === item.href ? "location" : undefined}
                  className={`relative block rounded-full px-3 py-1.5 text-[13px] transition-colors duration-300 xl:px-3.5 ${
                    lit ? "text-paper" : "text-paper-dim hover:text-paper"
                  }`}
                >
                  {item.label}
                </a>
              </li>
            );
          })}
        </ul>

        <div className="hidden items-center gap-2 lg:flex">
          <ThemeToggle />
          <a
            href={profile.resumePath}
            download
            className="group flex items-center gap-2 rounded-full bg-pen px-4 py-2 text-sm font-semibold text-[#1a0f0c] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_4px_0_-1px_var(--color-paper)]"
          >
            Resume
            <svg aria-hidden viewBox="0 0 16 16" className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-y-0.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M8 2v8m0 0-3-3m3 3 3-3M3 13h10" />
            </svg>
          </a>
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Close menu" : "Open menu"}
            className="flex h-9 w-9 flex-col items-center justify-center gap-[5px]"
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
        </div>
      </nav>

      {/* Mobile sheet */}
      <div
        id="mobile-nav"
        hidden={!open}
        className="border-t border-ink-700 bg-ink-950/95 backdrop-blur-xl lg:hidden"
      >
        <ul className="mx-auto max-w-6xl px-6 py-4">
          {nav.map((item) => (
            <li key={item.href} className="border-b border-ink-800 last:border-0">
              <a
                href={item.href}
                onClick={() => setOpen(false)}
                aria-current={active === item.href ? "location" : undefined}
                className={`block py-3.5 text-base ${
                  active === item.href ? "text-pen" : "text-paper-dim"
                }`}
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
              className="block rounded-full bg-pen py-3 text-center text-sm font-semibold text-[#1a0f0c]"
            >
              Download Resume
            </a>
          </li>
        </ul>
      </div>

      {/* Reading progress */}
      <motion.div
        style={{ scaleX: progress }}
        className="h-[2px] origin-left bg-gradient-to-r from-pen via-gold-400 to-pen"
      />
    </header>
  );
}
