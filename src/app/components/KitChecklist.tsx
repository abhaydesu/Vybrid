"use client";

import { useState } from "react";

import { CheckIcon } from "./Icons";

interface KitChecklistProps {
  items: string[];
  /** Items the site already provides, e.g. "Timer". */
  builtIn?: string[];
}

export default function KitChecklist({ items, builtIn = [] }: KitChecklistProps) {
  const [checked, setChecked] = useState<Set<string>>(new Set());

  if (items.length === 0) {
    return (
      <p className="font-semibold text-ink/70">
        Nothing at all. Just your people and this page.
      </p>
    );
  }

  function toggle(item: string) {
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(item)) next.delete(item);
      else next.add(item);
      return next;
    });
  }

  return (
    <ul className="flex flex-col gap-2.5">
      {items.map((item) => {
        const provided = builtIn.includes(item);
        const done = provided || checked.has(item);
        return (
          <li key={item}>
            <button
              type="button"
              disabled={provided}
              aria-pressed={done}
              onClick={() => toggle(item)}
              className="keycap tone-green h-auto min-h-12 w-full justify-start px-3 py-2 text-left disabled:cursor-default"
            >
              <span
                className={`grid h-6 w-6 shrink-0 place-items-center rounded-lg border-2 transition-colors ${
                  done
                    ? "border-[#178443] bg-[#25b35f] text-white"
                    : "border-line bg-white text-transparent"
                }`}
              >
                <CheckIcon width={15} height={15} strokeWidth={3} />
              </span>
              <span className="flex-1 text-[0.95rem]">{item}</span>
              {provided && (
                <span className="rounded-md bg-white/70 px-2 py-0.5 text-xs font-bold text-[#178443]">
                  Built in
                </span>
              )}
            </button>
          </li>
        );
      })}
    </ul>
  );
}
