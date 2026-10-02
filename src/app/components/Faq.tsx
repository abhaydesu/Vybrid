"use client";

import { useId, useState } from "react";
import Link from "next/link";

import type { Faq as FaqItem } from "@/lib/faq";

/** Toggle colours, cycling down the list. */
const COLORS = ["#ff4b3e", "#2f7bff", "#1fbf6a", "#ffc21a", "#ff7a1a", "#7c5cff", "#ff4f9a"];

/**
 * Each question is a neutral LEGO brick with a coloured 1×1 brick as its
 * toggle. The answer eases open (grid rows 0fr → 1fr). Closed answers stay in
 * the page for search engines but are inert for keyboards and screen readers.
 */
export default function Faq({ items }: { items: FaqItem[] }) {
  const [open, setOpen] = useState<number | null>(null);
  const base = useId();

  return (
    <ul className="flex flex-col gap-4">
      {items.map((item, i) => {
        const isOpen = open === i;
        const panel = `${base}-panel-${i}`;
        const button = `${base}-button-${i}`;
        const color = COLORS[i % COLORS.length];
        return (
          <li key={item.question} className="lego-card lego-card-static px-5 sm:px-6">
            <span className="lego-card-studs" aria-hidden="true">
              <span />
              <span />
            </span>
            <h3>
              <button
                id={button}
                type="button"
                aria-expanded={isOpen}
                aria-controls={panel}
                onClick={() => setOpen(isOpen ? null : i)}
                className="flex w-full items-start justify-between gap-5 py-5 text-left font-display text-lg font-semibold leading-snug text-ink lg:text-xl"
              >
                {item.question}
                <span
                  aria-hidden="true"
                  className="lego-badge faq-icon shrink-0"
                  data-open={isOpen}
                  style={
                    {
                      "--c": color,
                      color: color === "#ffc21a" ? "#141414" : "white",
                    } as React.CSSProperties
                  }
                >
                  <span />
                  <span />
                </span>
              </button>
            </h3>
            <div
              id={panel}
              role="region"
              aria-labelledby={button}
              inert={!isOpen}
              className="faq-panel"
              data-open={isOpen}
            >
              <div className="overflow-hidden">
                <div className="faq-body pb-6 pr-2 sm:pr-14">
                  <p className="text-[1.05rem] leading-relaxed text-ink-soft lg:text-lg">
                    {item.answer}
                  </p>
                  {item.link && (
                    <Link
                      href={item.link.href}
                      className="mt-3 inline-flex items-center gap-1 font-semibold text-ink underline decoration-line decoration-2 underline-offset-4 transition-colors hover:decoration-ink"
                    >
                      {item.link.label} →
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
