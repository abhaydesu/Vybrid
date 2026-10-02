"use client";

import { useState } from "react";

import { playerScore, useImposter } from "@/store/imposterStore";
import EndGameButton from "../EndGameButton";

export default function Scoreboard() {
  const state = useImposter();
  const [editing, setEditing] = useState(false);
  const roundNumber = state.round?.number ?? state.history.length + 1;

  return (
    <section aria-label="Scoreboard" className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center justify-end gap-2">
        <span className="chip tone-white mr-auto">Round {roundNumber}</span>
        <button
          type="button"
          onClick={state.toggleMuted}
          aria-label={state.muted ? "Turn sound on" : "Mute sound"}
          className="keycap tone-white h-9 w-9 text-sm"
        >
          {state.muted ? "🔇" : "🔊"}
        </button>
        <button
          type="button"
          onClick={() => setEditing((e) => !e)}
          aria-pressed={editing}
          className="keycap tone-white h-9 px-3 text-xs"
        >
          {editing ? "Done" : "Scores"}
        </button>
        <EndGameButton onEnd={state.endGame} />
      </div>

      {editing && (
        <>
          <ol className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {state.players.map((p) => (
              <li
                key={p.id}
                className="brick brick-flat tone-white flex items-center gap-2 px-2.5 py-2"
              >
                <span className="min-w-0 flex-1 truncate text-sm font-bold">
                  {p.name}
                </span>
                <button
                  type="button"
                  aria-label={`Take a point from ${p.name}`}
                  onClick={() => state.adjustScore(p.id, -1)}
                  className="keycap tone-white h-7 w-7 text-sm"
                >
                  −
                </button>
                <span className="w-6 text-center font-display text-xl font-extrabold tabular-nums">
                  {playerScore(state, p.id)}
                </span>
                <button
                  type="button"
                  aria-label={`Give a point to ${p.name}`}
                  onClick={() => state.adjustScore(p.id, 1)}
                  className="keycap tone-white h-7 w-7 text-sm"
                >
                  +
                </button>
              </li>
            ))}
          </ol>
          <p className="text-center text-xs text-ink/50">
            Crew +1 each for catching the imposter · imposter +2 for getting
            away · +1 for stealing with the right guess.
          </p>
        </>
      )}
    </section>
  );
}
