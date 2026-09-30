"use client";

import { useState } from "react";

import {
  currentRound,
  currentTeam,
  pendingAward,
  teamScore,
  usePictionary,
} from "@/store/pictionaryStore";

export default function Scoreboard() {
  const state = usePictionary();
  const [editing, setEditing] = useState(false);
  const [confirmEnd, setConfirmEnd] = useState(false);

  const active = currentTeam(state);
  const pending = pendingAward(state);
  const round = Math.min(currentRound(state), state.settings.turnsPerTeam);

  return (
    <section aria-label="Scoreboard" className="flex flex-col gap-3">
      <div className="flex items-center justify-between gap-2">
        <span className="chip tone-white">
          Round {round} of {state.settings.turnsPerTeam}
        </span>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={state.toggleMuted}
            aria-label={state.muted ? "Turn sound on" : "Mute sound"}
            className="keycap tone-white h-9 px-3 text-xs"
          >
            {state.muted ? "🔇 Muted" : "🔊 Sound"}
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

      <ol
        className="grid gap-2"
        style={{
          gridTemplateColumns: `repeat(${state.teams.length}, minmax(0, 1fr))`,
        }}
      >
        {state.teams.map((team) => {
          const isActive = team.id === active?.id;
          const score = teamScore(team, state.history);
          return (
            <li
              key={team.id}
              className={`brick brick-flat tone-${team.tone} flex flex-col items-center px-1.5 pb-2 pt-2 text-center ${
                isActive ? "" : "opacity-60 saturate-50"
              }`}
              aria-current={isActive ? "true" : undefined}
            >
              <span className="w-full truncate text-[0.7rem] font-bold leading-tight sm:text-xs">
                {team.name}
              </span>
              <span className="relative font-display text-3xl font-extrabold tabular-nums leading-none">
                {score}
                {pending === team.id && (
                  <span className="absolute -right-6 -top-1 rounded-full bg-[var(--tone-solid)] px-1.5 text-xs text-white">
                    +1
                  </span>
                )}
              </span>
              {editing && (
                <span className="mt-2 flex gap-1">
                  <button
                    type="button"
                    aria-label={`Take a point from ${team.name}`}
                    onClick={() => state.adjustScore(team.id, -1)}
                    className="keycap tone-white h-8 w-8 text-base"
                  >
                    −
                  </button>
                  <button
                    type="button"
                    aria-label={`Give a point to ${team.name}`}
                    onClick={() => state.adjustScore(team.id, 1)}
                    className="keycap tone-white h-8 w-8 text-base"
                  >
                    +
                  </button>
                </span>
              )}
            </li>
          );
        })}
      </ol>

      {editing && (
        <button
          type="button"
          onClick={() => {
            if (confirmEnd) state.endGame();
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
