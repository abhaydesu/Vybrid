"use client";

import { useEffect, useRef, useState } from "react";

import type { Tone } from "@/lib/games";
import { sfx } from "@/lib/sfx";
import { ClockIcon } from "./Icons";
import { LegoStuds, legoFor } from "./LegoButton";

interface TimerProps {
  initialSeconds?: number;
  presets?: number[];
  tone?: Tone;
  title?: string;
  onComplete?: () => void;
}

export default function Timer({
  initialSeconds = 60,
  presets = [30, 60, 90, 120],
  tone = "blue",
  title = "Round timer",
  onComplete,
}: TimerProps) {
  const [length, setLength] = useState(initialSeconds);
  const [seconds, setSeconds] = useState(initialSeconds);
  const [running, setRunning] = useState(false);
  const endAtRef = useRef(0);

  useEffect(() => {
    if (!running) return;
    const id = window.setInterval(() => {
      const left = Math.max(0, Math.ceil((endAtRef.current - Date.now()) / 1000));
      setSeconds(left);
      if (left === 0) {
        window.clearInterval(id);
        setRunning(false);
        sfx.buzzer();
        onComplete?.();
      }
    }, 200);
    return () => window.clearInterval(id);
  }, [running, onComplete]);

  function start() {
    sfx.unlock();
    const from = seconds <= 0 ? length : seconds;
    setSeconds(from);
    endAtRef.current = Date.now() + from * 1000;
    setRunning(true);
  }

  function pause() {
    setRunning(false);
  }

  function reset(next = length) {
    setRunning(false);
    setLength(next);
    setSeconds(next);
  }

  const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
  const ss = String(seconds % 60).padStart(2, "0");
  const progress = length ? seconds / length : 0;
  const urgent = running && seconds <= 10;
  const done = seconds === 0;

  const lego = `lego-btn lego-${legoFor(tone)}`;

  return (
    <div className={`lego-card lego-card-static tone-${tone} p-5`}>
      <LegoStuds count={2} className="lego-card-studs" />
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="flex items-center gap-2 font-display text-xl font-bold text-ink">
          <ClockIcon width={20} height={20} /> {title}
        </h3>
        <div className="flex gap-1.5">
          {presets.map((p) => (
            <button
              key={p}
              type="button"
              aria-pressed={length === p}
              onClick={() => reset(p)}
              className="keycap tone-white h-9 min-w-11 px-2 text-xs"
            >
              {p < 60 ? `${p}s` : `${p / 60}m`}
            </button>
          ))}
        </div>
      </div>

      <div
        className={`mt-4 overflow-hidden rounded-2xl border-[1.5px] border-[#ecebe7] bg-white px-4 pb-4 pt-3 text-center ${
          urgent ? "animate-wobble" : ""
        }`}
      >
        <div
          role="timer"
          aria-live={done ? "assertive" : "off"}
          className={`font-display text-[clamp(4rem,22vw,6.5rem)] font-bold leading-none tabular-nums tracking-tight transition-colors ${
            urgent || done ? "text-[#e2412d]" : "text-ink"
          }`}
        >
          {done ? "Time!" : `${mm}:${ss}`}
        </div>
        <div className="mt-3 h-3 overflow-hidden rounded-full bg-black/5">
          <div
            className="h-full rounded-full transition-[width] duration-200 ease-linear"
            style={{
              width: `${progress * 100}%`,
              background: `var(--lego-${legoFor(tone)})`,
            }}
          />
        </div>
      </div>

      <div className="mt-5 grid grid-cols-[1fr_auto] gap-3">
        {running ? (
          <button type="button" onClick={pause} className="lego-btn lego-yellow">
            <LegoStuds count={3} />
            Pause
          </button>
        ) : (
          <button type="button" onClick={start} className={lego}>
            <LegoStuds count={3} />
            {done ? "Again" : seconds < length ? "Resume" : "Start"}
          </button>
        )}
        <button type="button" onClick={() => reset()} className="lego-btn lego-white">
          <LegoStuds count={2} />
          Reset
        </button>
      </div>
    </div>
  );
}
