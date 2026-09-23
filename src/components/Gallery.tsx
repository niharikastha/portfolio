"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import type { GalleryPhoto } from "@/content/site";
import { Reveal, Section } from "./primitives";

type Photo = GalleryPhoto & { src: string };

export function Gallery({ photos }: { photos: Photo[] }) {
  const reduced = useReducedMotion();
  const tags = useMemo(() => [...new Set(photos.map((p) => p.tag))], [photos]);
  const [filter, setFilter] = useState<string>("All");
  const [open, setOpen] = useState<number | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const lastTrigger = useRef<HTMLElement | null>(null);

  const shown = filter === "All" ? photos : photos.filter((p) => p.tag === filter);

  const close = useCallback(() => {
    setOpen(null);
    lastTrigger.current?.focus();
  }, []);
  const move = useCallback(
    (dir: 1 | -1) => setOpen((i) => (i === null ? i : (i + dir + shown.length) % shown.length)),
    [shown.length],
  );

  // Keyboard controls and scroll lock while the viewer is open
  useEffect(() => {
    if (open === null) return;
    closeRef.current?.focus();
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") move(1);
      if (e.key === "ArrowLeft") move(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open, close, move]);

  const current = open === null ? null : shown[open];

  return (
    <Section
      id="gallery"
      title="Gallery"
      lead="Some photos from GDG events, hackathons and other places I've been with the developer community."
    >
      {tags.length > 1 ? (
        <div role="group" aria-label="Filter photos" className="mb-8 flex flex-wrap gap-2">
          {["All", ...tags].map((t) => (
            <button
              key={t}
              type="button"
              aria-pressed={filter === t}
              onClick={() => setFilter(t)}
              className={`rounded-full border px-4 py-1.5 text-sm transition-colors duration-300 ${
                filter === t
                  ? "border-gold-400 bg-gold-400 text-ink-950"
                  : "border-ink-700 text-paper-dim hover:border-ink-600 hover:text-paper"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      ) : null}

      <ul className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
        {shown.map((photo, i) => (
          <li key={photo.file} className={i === 0 && shown.length > 2 ? "col-span-2 row-span-2" : ""}>
            <Reveal delay={Math.min(i, 6) * 0.04} className="h-full">
              <button
                type="button"
                onClick={(e) => {
                  lastTrigger.current = e.currentTarget;
                  setOpen(i);
                }}
                className="group relative block aspect-[4/3] h-full w-full overflow-hidden rounded-xl border border-ink-700 bg-ink-850"
              >
                <Image
                  src={photo.src}
                  alt={photo.caption}
                  fill
                  sizes="(min-width: 1024px) 33vw, 50vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                />
                <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 to-transparent p-3 pt-10 text-left text-xs text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100">
                  {photo.caption}
                </span>
              </button>
            </Reveal>
          </li>
        ))}
      </ul>

      <AnimatePresence>
        {current ? (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={current.caption}
            initial={reduced ? undefined : { opacity: 0 }}
            animate={reduced ? undefined : { opacity: 1 }}
            exit={reduced ? undefined : { opacity: 0 }}
            className="fixed inset-0 z-[150] flex flex-col bg-black/90 backdrop-blur-sm"
            onClick={close}
          >
            <div className="flex items-center justify-between p-4 text-sm text-white/80">
              <span className="nums">
                {(open ?? 0) + 1} / {shown.length}
              </span>
              <button
                ref={closeRef}
                type="button"
                onClick={close}
                aria-label="Close"
                className="flex h-10 w-10 items-center justify-center rounded-full text-xl text-white hover:bg-white/10"
              >
                ✕
              </button>
            </div>

            <div className="relative flex-1" onClick={(e) => e.stopPropagation()}>
              <Image
                key={current.src}
                src={current.src}
                alt={current.caption}
                fill
                sizes="100vw"
                className="object-contain"
              />
              {shown.length > 1 ? (
                <>
                  <button
                    type="button"
                    onClick={() => move(-1)}
                    aria-label="Previous photo"
                    className="absolute left-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-white hover:bg-black/70"
                  >
                    ←
                  </button>
                  <button
                    type="button"
                    onClick={() => move(1)}
                    aria-label="Next photo"
                    className="absolute right-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-white hover:bg-black/70"
                  >
                    →
                  </button>
                </>
              ) : null}
            </div>

            <p className="p-5 text-center text-sm text-white/85">
              {current.caption}
              {current.date ? <span className="text-white/50"> · {current.date}</span> : null}
            </p>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </Section>
  );
}
