"use client";

import { useState } from "react";

import { multiplier, useTop9 } from "@/store/top9Store";

export default function Scoreboard() {
  const s = useTop9();
  const [editing, setEditing] = useState(false);
  const [confirmEnd, setConfirmEnd] = useState(false);
  const double = multiplier(s) > 1;
  const active =
    s.phase === "steal" && s.control !== null ? 1 - s.control : s.control;

  return (
    <section aria-label="Scoreboard" className="flex flex-col gap-3">
      <div className="flex items-center justify-between gap-2">
        <span className="chip tone-white">
          Round {Math.min(s.round + 1, s.settings.rounds)} of{" "}
          {s.settings.rounds}
          {double && <strong className="text-[#c63a28]"> · ×2</strong>}
        </span>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={s.toggleMuted}
            aria-label={s.muted ? "Turn sound on" : "Mute sound"}
            className="keycap tone-white h-9 px-3 text-xs"
          >
            {s.muted ? "🔇 Muted" : "🔊 Sound"}
          </button>
          <button
            type="button"
            onClick={() => setEditing((e) => !e)}
            aria-pressed={editing}
            className="keycap tone-white h-9 px-3 text-xs"
          >
            {editing ? "Done" : "Edit scores"}
          </button>
        </div>
      </div>

      <ol className="grid grid-cols-2 gap-2">
        {s.teams.map((team, i) => (
          <li
            key={i}
            aria-current={active === i ? "true" : undefined}
            className={`brick brick-flat tone-${team.tone} flex flex-col items-center px-2 pb-2 pt-2 text-center transition-opacity ${
              active === null || active === i ? "" : "opacity-60 saturate-50"
            }`}
          >
            <span className="w-full truncate text-xs font-bold">
              {team.name}
            </span>
            <span className="font-display text-3xl font-extrabold tabular-nums leading-none">
              {team.score}
            </span>
            {editing && (
              <span className="mt-2 flex gap-1">
                <button
                  type="button"
                  aria-label={`Take 5 points from ${team.name}`}
                  onClick={() => s.adjustScore(i, -5)}
                  className="keycap tone-white h-8 px-2 text-xs"
                >
                  −5
                </button>
                <button
                  type="button"
                  aria-label={`Give 5 points to ${team.name}`}
                  onClick={() => s.adjustScore(i, 5)}
                  className="keycap tone-white h-8 px-2 text-xs"
                >
                  +5
                </button>
              </span>
            )}
          </li>
        ))}
      </ol>

      {editing && (
        <button
          type="button"
          onClick={() => {
            if (confirmEnd) s.endGame();
            setConfirmEnd((c) => !c);
          }}
          className="self-center text-sm font-bold text-[#c63a28] underline underline-offset-4"
        >
          {confirmEnd ? "Tap again to end the game now" : "End game early"}
        </button>
      )}
    </section>
  );
}
