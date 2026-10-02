"use client";

import { useEffect, useState } from "react";

import { sfx } from "@/lib/sfx";
import Mascot from "./Mascot";

/**
 * The hero phone: a tiny, playable Baithak built from the same pieces as
 * the real games (round chip, coloured stage brick, inset card, 3D buttons,
 * brick tiles). Deal Imposter cards and vote, reveal a Top 9 board, or race
 * the Pictionary clock, all with real words. Only the open game is rendered.
 */

type Tab = "imposter" | "top9" | "pictionary";

const TABS: Array<{ id: Tab; label: string }> = [
  { id: "imposter", label: "Imposter" },
  { id: "top9", label: "Top 9" },
  { id: "pictionary", label: "Pictionary" },
];

function play(name: keyof typeof sfx) {
  sfx.unlock();
  sfx[name]();
}

export default function PhoneDemo() {
  const [tab, setTab] = useState<Tab>("imposter");
  const tone = tab === "imposter" ? "green" : tab === "top9" ? "yellow" : "blue";
  const round = tab === "imposter" ? "Round 1" : tab === "top9" ? "Round 3 of 5" : "Round 2 of 3";

  return (
    <div className="rounded-[2.4rem] bg-ink p-2 shadow-[0_30px_50px_-24px_rgb(0_0_0/0.55)]">
      <div className="relative flex aspect-[9/18] flex-col overflow-hidden rounded-[1.95rem] bg-white">
        <div className="mx-auto mt-2 h-5 w-16 shrink-0 rounded-full bg-ink" />
        {/* The game's own top bar: round chip and End game, like the real thing */}
        <div className="flex shrink-0 items-center justify-between px-3 pt-2.5">
          <span className="chip tone-white px-2 py-0.5 text-[0.6rem]">{round}</span>
          <span className="keycap tone-white h-6 px-2 text-[0.58rem] text-[#c63a28]">End game</span>
        </div>
        {/* The stage brick */}
        <div className="flex min-h-0 flex-1 flex-col px-2.5 pb-2 pt-4">
          <div className={`brick brick-flat tone-${tone} flex min-h-0 flex-1 flex-col p-3`}>
            <span className="studs" aria-hidden="true" style={{ top: -8, left: 14, gap: 6 }}>
              {[0, 1, 2].map((i) => (
                <span key={i} className="stud" style={{ width: 18, height: 8 }} />
              ))}
            </span>
            {tab === "imposter" && <ImposterDemo />}
            {tab === "top9" && <Top9Demo />}
            {tab === "pictionary" && <PictionaryDemo />}
          </div>
        </div>
        {/* Pick a game */}
        <nav aria-label="Try a game" className="grid shrink-0 grid-cols-3 gap-1.5 px-2.5 pb-3.5 pt-1">
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              aria-pressed={tab === t.id}
              onClick={() => {
                play("tap");
                setTab(t.id);
              }}
              className="keycap tone-white h-8 text-[0.66rem]"
            >
              {t.label}
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
}

// ------------------------------------------------------------------ bits

/** Small caps label, as in the game screens. */
function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[0.54rem] font-bold uppercase tracking-[0.16em] text-ink/55">{children}</p>
  );
}

/** The 3D game button, sized for the phone. */
function Btn({
  children,
  onClick,
  tone = "green",
}: {
  children: React.ReactNode;
  onClick: () => void;
  tone?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`btn tone-${tone} btn-sm min-h-9 w-full rounded-[0.7rem] text-[0.74rem]`}
    >
      {children}
    </button>
  );
}

// ------------------------------------------------------------------ imposter

const PLAYERS = ["Asha", "Ravi", "Meera", "Kabir"];
const WORDS = [
  { word: "Biryani", hint: "Rice" },
  { word: "Golgappe", hint: "Water" },
  { word: "Mehendi", hint: "Hands" },
  { word: "Patakhe", hint: "Noise" },
  { word: "Parle-G", hint: "Biscuit" },
];

function newDeal() {
  return {
    word: WORDS[Math.floor(Math.random() * WORDS.length)],
    imposter: Math.floor(Math.random() * PLAYERS.length),
  };
}

function ImposterDemo() {
  // The first deal is fixed so server and client render the same thing.
  const [deal, setDeal] = useState({ word: WORDS[0], imposter: 2 });
  const [turn, setTurn] = useState(0);
  const [shown, setShown] = useState(false);
  const [picked, setPicked] = useState<number | null>(null);
  const [voted, setVoted] = useState<number | null>(null);

  const restart = () => {
    setDeal(newDeal());
    setTurn(0);
    setShown(false);
    setPicked(null);
    setVoted(null);
  };

  // Everyone has seen their card: vote, then the verdict.
  if (turn >= PLAYERS.length) {
    if (voted !== null) {
      const caught = voted === deal.imposter;
      return (
        <div className="flex h-full flex-col items-center justify-between gap-2 text-center">
          <div className="flex flex-col items-center">
            <Mascot kind={caught ? "chai" : "golgappa"} mood={caught ? "shocked" : "sweaty"} className="h-14 w-14" />
            <p className="mt-2 font-display text-[1.1rem] font-extrabold leading-tight text-ink">
              {caught ? `${PLAYERS[voted]} was the imposter!` : `${PLAYERS[voted]} was innocent.`}
            </p>
            <p className="mt-1 text-[0.66rem] text-ink/70">
              {caught
                ? `The word was ${deal.word.word}.`
                : `${PLAYERS[deal.imposter]} gets away with it.`}
            </p>
          </div>
          <Btn tone={caught ? "green" : "red"} onClick={restart}>
            Deal again
          </Btn>
        </div>
      );
    }
    return (
      <div className="flex h-full flex-col gap-2">
        <div className="text-center">
          <Eyebrow>Point on three</Eyebrow>
          <p className="mt-0.5 font-display text-[1rem] font-extrabold text-ink">Who&apos;s the imposter?</p>
        </div>
        <div className="grid flex-1 grid-cols-2 content-center gap-1.5">
          {PLAYERS.map((p, i) => (
            <button
              key={p}
              type="button"
              aria-pressed={picked === i}
              onClick={() => {
                play("tap");
                setPicked(i);
              }}
              className="keycap tone-white h-10 font-display text-[0.78rem]"
            >
              {p}
            </button>
          ))}
        </div>
        <Btn
          tone="red"
          onClick={() => {
            if (picked === null) return;
            play(picked === deal.imposter ? "ding" : "buzzer");
            setVoted(picked);
          }}
        >
          {picked === null ? "Tap a player" : `Vote out ${PLAYERS[picked]}`}
        </Btn>
      </div>
    );
  }

  const isImposter = turn === deal.imposter;
  const next = PLAYERS[turn + 1];

  // Pass screen
  if (!shown) {
    return (
      <div className="flex h-full flex-col items-center justify-between gap-2 text-center">
        <div className="flex flex-col items-center">
          <Eyebrow>
            Card {turn + 1} of {PLAYERS.length}
          </Eyebrow>
          <Mascot kind="didi" mood="shifty" color="#1fbf6a" className="mt-2 h-14 w-14" />
          <p className="mt-2 text-[0.72rem] text-ink/65">Pass the phone to</p>
          <p className="font-display text-[1.7rem] font-extrabold leading-none text-ink">{PLAYERS[turn]}</p>
          <p className="mt-1.5 text-[0.6rem] text-ink/55">Everyone else, eyes off.</p>
        </div>
        <Btn
          onClick={() => {
            play("tap");
            setShown(true);
          }}
        >
          I&apos;m {PLAYERS[turn]}, show my card
        </Btn>
      </div>
    );
  }

  // The card
  return (
    <div className="flex h-full flex-col gap-2">
      <Eyebrow>{PLAYERS[turn]} only 🤫</Eyebrow>
      <div className="inset-well flex flex-1 flex-col items-center justify-center px-2 text-center">
        {isImposter ? (
          <>
            <p className="text-[0.56rem] font-bold uppercase tracking-[0.16em] text-ink/55">You are the</p>
            <p className="font-display text-[1.6rem] font-extrabold leading-none text-[#c63a28]">Imposter</p>
            <p className="mt-2 text-[0.7rem] text-ink">
              Hint: <strong>{deal.word.hint}</strong>
            </p>
          </>
        ) : (
          <>
            <p className="text-[0.56rem] font-bold uppercase tracking-[0.16em] text-ink/55">The secret word is</p>
            <p className="mt-1 font-display text-[1.6rem] font-extrabold leading-none text-ink">{deal.word.word}</p>
          </>
        )}
      </div>
      <Btn
        tone="white"
        onClick={() => {
          play("tap");
          setShown(false);
          setTurn((t) => t + 1);
        }}
      >
        {next ? `Got it. Hide & pass to ${next}` : "Got it. Hide my card"}
      </Btn>
    </div>
  );
}

// ------------------------------------------------------------------ top 9

const BOARDS = [
  {
    q: "Name something Indian moms always say.",
    answers: [
      ["Eat something", 22],
      ["Wear a sweater", 14],
      ["Sharma ji's son", 13],
      ["Put your phone down", 12],
      ["I'm not your servant", 9],
      ["Go to sleep", 8],
    ],
  },
  {
    q: "Name a question aunties always ask at family functions.",
    answers: [
      ["When are you getting married?", 38],
      ["What are your marks?", 14],
      ["How much do you earn?", 12],
      ["Have you gained weight?", 10],
      ["When is the good news?", 8],
      ["What are you doing these days?", 6],
    ],
  },
] as const;

function Top9Demo() {
  const [board, setBoard] = useState(0);
  const [open, setOpen] = useState<number[]>([]);
  const { q, answers } = BOARDS[board];
  const pot = open.reduce((n, i) => n + answers[i][1], 0);
  const cleared = open.length === answers.length;

  return (
    <div className="flex h-full flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <Eyebrow>Host: tap to reveal</Eyebrow>
        <span className="chip tone-white px-1.5 py-0 text-[0.56rem]">Pot {pot}</span>
      </div>
      <p className="font-display text-[0.8rem] font-extrabold leading-snug text-ink">{q}</p>
      <ol className="flex flex-col gap-1">
        {answers.map(([answer, points], i) => {
          const shown = open.includes(i);
          return (
            <li key={answer}>
              <button
                type="button"
                disabled={shown}
                onClick={() => {
                  play("ding");
                  setOpen((o) => [...o, i]);
                }}
                className={`brick brick-flat ${shown ? "tone-yellow" : "tone-blue brick-press"} flex min-h-7 w-full items-center gap-1.5 rounded-[0.55rem] px-1.5 py-0.5 text-left disabled:cursor-default`}
                style={{ "--lift": "2px" } as React.CSSProperties}
              >
                <span className="grid h-4.5 w-4.5 shrink-0 place-items-center rounded-[0.3rem] border-[1.5px] border-[var(--tone-dark)] bg-white px-1 font-display text-[0.55rem] font-extrabold">
                  {i + 1}
                </span>
                <span className="min-w-0 flex-1 truncate text-[0.6rem] font-bold text-ink">{shown ? answer : ""}</span>
                {shown && (
                  <span className="font-display text-[0.66rem] font-extrabold tabular-nums text-ink">{points}</span>
                )}
              </button>
            </li>
          );
        })}
      </ol>
      <div className="mt-auto">
        <Btn
          tone={cleared ? "green" : "white"}
          onClick={() => {
            play("tap");
            setBoard((b) => (b + 1) % BOARDS.length);
            setOpen([]);
          }}
        >
          {cleared ? "Board cleared! Next one" : "Skip question"}
        </Btn>
      </div>
    </div>
  );
}

// ------------------------------------------------------------------ pictionary

const DRAW = ["Auto rickshaw", "Diya", "Kite", "Samosa", "Rangoli", "Lassi", "Chai"];
const ROUND = 30;

function PictionaryDemo() {
  const [index, setIndex] = useState(0);
  const [left, setLeft] = useState(ROUND);
  const [running, setRunning] = useState(false);
  const [score, setScore] = useState(0);

  // One second at a time while the clock runs.
  useEffect(() => {
    if (!running) return;
    const id = window.setInterval(() => setLeft((l) => Math.max(0, l - 1)), 1000);
    return () => window.clearInterval(id);
  }, [running]);

  // Ticks near the end, the buzzer at zero.
  useEffect(() => {
    if (!running) return;
    if (left === 0) {
      sfx.buzzer();
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setRunning(false);
    } else if (left <= 5) {
      sfx.tick();
    }
  }, [left, running]);

  const nextWord = () => setIndex((i) => (i + 1) % DRAW.length);
  const urgent = running && left <= 5;

  return (
    <div className="flex h-full flex-col gap-2">
      <div className="flex items-center justify-between gap-2">
        <Eyebrow>Blue Whales · {score}</Eyebrow>
        <PeekButton word={DRAW[index]} />
      </div>
      <div className="inset-well px-2 pb-2.5 pt-2 text-center">
        <p
          className="font-display text-[2.6rem] font-extrabold leading-none tabular-nums"
          style={{ color: urgent ? "#e2412d" : "#141414" }}
        >
          0:{String(left).padStart(2, "0")}
        </p>
        <div className="mt-2 h-2 overflow-hidden rounded-full bg-black/5">
          <div
            className="h-full rounded-full"
            style={{ width: `${(left / ROUND) * 100}%`, background: "var(--tone-solid)", transition: "width 1s linear" }}
          />
        </div>
      </div>
      <div className="flex flex-1 flex-col items-center justify-center text-center">
        <Mascot kind="dice" mood={running ? "cheer" : "happy"} color="#2f7bff" className="h-12 w-12" />
        <p className="mt-1.5 text-[0.62rem] font-semibold text-ink/60">
          {running ? "Draw it! No letters, no talking." : "Hold to peek at your word."}
        </p>
      </div>
      <div className="flex flex-col gap-1.5">
        {running ? (
          <>
            <Btn
              onClick={() => {
                play("success");
                setScore((s) => s + 1);
                nextWord();
              }}
            >
              They got it!
            </Btn>
            <div className="grid grid-cols-2 gap-1.5">
              <Btn tone="white" onClick={() => setRunning(false)}>
                Pause
              </Btn>
              <Btn
                tone="white"
                onClick={() => {
                  play("tap");
                  nextWord();
                }}
              >
                Give up
              </Btn>
            </div>
          </>
        ) : (
          <Btn
            tone="blue"
            onClick={() => {
              play("tap");
              if (left === 0) setLeft(ROUND);
              setRunning(true);
            }}
          >
            {left === 0 ? "Time! Go again" : left < ROUND ? "Resume" : "Start the clock"}
          </Btn>
        )}
      </div>
    </div>
  );
}

/** Hold to see the word, like the real drawing screen. */
function PeekButton({ word }: { word: string }) {
  const [peek, setPeek] = useState(false);
  return (
    <button
      type="button"
      onPointerDown={() => setPeek(true)}
      onPointerUp={() => setPeek(false)}
      onPointerLeave={() => setPeek(false)}
      onPointerCancel={() => setPeek(false)}
      onContextMenu={(e) => e.preventDefault()}
      className="keycap tone-white h-6 select-none px-2 text-[0.58rem] [-webkit-touch-callout:none]"
    >
      {peek ? word : "Hold to peek"}
    </button>
  );
}
