"use client";

import { useEffect, useSyncExternalStore } from "react";

import { useWakeLock } from "@/lib/useWakeLock";
import { currentTeam, pickingTeam, useDumbCharades } from "@/store/dumbCharadesStore";
import Studs from "../Studs";
import GameOver from "./GameOver";
import Scoreboard from "./Scoreboard";
import Setup from "./Setup";
import { Acting, Choose, Handoff, Pass, Ready, Result } from "./TurnScreens";

const subscribeHydration = (cb: () => void) => useDumbCharades.persist.onFinishHydration(cb);

export default function DumbCharadesGame() {
  const hydrated = useSyncExternalStore(
    subscribeHydration,
    () => useDumbCharades.persist.hasHydrated(),
    () => false,
  );

  useEffect(() => {
    void useDumbCharades.persist.rehydrate();
  }, []);

  const phase = useDumbCharades((s) => s.phase);
  // The stage takes the colour of whoever holds the phone right now.
  const tone = useDumbCharades((s) => {
    if (s.phase === "setup" || s.phase === "gameover") return "white";
    const holder = s.phase === "handoff" || s.phase === "choose" ? pickingTeam(s) : currentTeam(s);
    return holder?.tone ?? "white";
  });

  const inGame = phase !== "setup" && phase !== "gameover";
  useWakeLock(hydrated && inGame);

  if (!hydrated) {
    return (
      <div className="brick tone-white mt-3 grid min-h-[28rem] place-items-center p-6">
        <Studs count={3} />
        <p className="font-display text-lg font-bold text-ink/40">Warming up the room…</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      {inGame && <Scoreboard />}
      <div className={`brick tone-${tone} mt-3 min-h-[28rem] p-5 transition-colors sm:p-7`} aria-live="polite">
        <Studs count={3} />
        {phase === "setup" && <Setup />}
        {phase === "handoff" && <Handoff />}
        {phase === "choose" && <Choose />}
        {phase === "pass" && <Pass />}
        {phase === "ready" && <Ready />}
        {phase === "acting" && <Acting />}
        {phase === "result" && <Result />}
        {phase === "gameover" && <GameOver />}
      </div>
    </div>
  );
}
