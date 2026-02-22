"use client";

import { useEffect, useRef, useState } from "react";

interface TimerProps {
  initialSeconds?: number;
  onComplete?: () => void;
}

export default function Timer({ initialSeconds = 60, onComplete }: TimerProps) {
  const [seconds, setSeconds] = useState<number>(initialSeconds);
  const [running, setRunning] = useState<boolean>(false);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (running) {
      intervalRef.current = window.setInterval(() => {
        setSeconds((s) => {
          if (s <= 1) {
            setRunning(false);
            if (onComplete) onComplete();
            if (intervalRef.current) clearInterval(intervalRef.current);
            return 0;
          }
          return s - 1;
        });
      }, 1000);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [running, onComplete]);

  function start() {
    if (seconds <= 0) setSeconds(initialSeconds);
    setRunning(true);
  }
  function pause() {
    setRunning(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
  }
  function reset() {
    setRunning(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
    setSeconds(initialSeconds);
  }

  const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
  const ss = String(seconds % 60).padStart(2, "0");

  return (
    <div className="w-full rounded-2xl border border-blue-100 bg-white p-4 shadow-neon">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-semibold text-ink">Timer</h3>
          <p className="mt-1 text-sm text-ink/60">
            Use for sketch or acting rounds.
          </p>
        </div>
        <div className="text-2xl font-bold text-blue-700 tabular-nums">
          {mm}:{ss}
        </div>
      </div>

      <div className="mt-4 flex items-center gap-2">
        {!running ? (
          <button
            onClick={start}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
          >
            Start
          </button>
        ) : (
          <button
            onClick={pause}
            className="rounded-md bg-yellow-400 px-4 py-2 text-sm font-semibold text-ink hover:bg-yellow-300"
          >
            Pause
          </button>
        )}

        <button
          onClick={reset}
          className="rounded-md border border-blue-100 px-3 py-2 text-sm font-semibold text-ink"
        >
          Reset
        </button>

        <label className="ml-auto flex items-center gap-2 text-sm text-ink/60">
          Length
        </label>
      </div>
    </div>
  );
}
