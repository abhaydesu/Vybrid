import { create } from "zustand";
import { persist } from "zustand/middleware";

import {
  DEFAULT_CATEGORY_IDS,
  imposterCategories,
  imposterPool,
  type ImposterWord,
} from "@/lib/imposter/words";
import { STORAGE_KEYS } from "@/lib/storageKeys";
import { normalize, shuffle } from "@/lib/words/deck";

export const MIN_PLAYERS = 3;
export const MAX_PLAYERS = 15;

/** How often a round is a troll round, when troll rounds are on. */
const TROLL_CHANCE = 0.12;

export type Phase =
  | "setup"
  /** Phone goes to the next player. */
  | "pass"
  /** That player is looking at their card. */
  | "reveal"
  | "discuss"
  | "vote"
  | "verdict"
  /** Every imposter is caught; they get one guess at the word. */
  | "guess"
  | "roundover"
  | "gameover";

/** What the imposter sees: nothing, the category, or a one-word hint. */
export type HintSetting = "off" | "category" | "hint";

/**
 * classic: the imposter knows they're the imposter.
 * undercover: the imposter gets a different word from the same category and
 * doesn't know they're the odd one out.
 */
export type ImposterMode = "classic" | "undercover";

export type Outcome = "crew" | "imposters" | "steal" | "troll";

export interface Player {
  id: string;
  name: string;
}

export interface Settings {
  imposters: number;
  hint: HintSetting;
  mode: ImposterMode;
  troll: boolean;
  /** 0 = no clock. */
  discussSeconds: number;
  categories: string[];
}

export type Card =
  | { kind: "word"; word: string }
  | { kind: "imposter"; hint: string | null };

export interface Round {
  number: number;
  word: ImposterWord;
  imposterIds: string[];
  troll: boolean;
  cards: Record<string, Card>;
  /** Index into players of whoever holds the phone during the deal. */
  dealIndex: number;
  starterId: string;
  /** Imposters already voted out this round. */
  caught: string[];
  lastVotedId: string | null;
  outcome: Outcome | null;
}

export interface RoundRecord {
  number: number;
  word: string;
  categoryId: string;
  imposterIds: string[];
  outcome: Outcome;
  /** Points per player id. */
  awards: Record<string, number>;
}

interface Timer {
  endsAt: number | null;
  remainingMs: number;
}

interface ImposterState {
  phase: Phase;
  players: Player[];
  settings: Settings;
  round: Round | null;
  timer: Timer;
  /** Manual corrections from the scoreboard. */
  bonus: Record<string, number>;
  history: RoundRecord[];
  /** Words already used, across games, so they don't repeat. */
  played: string[];
  notice: string | null;
  muted: boolean;

  // setup
  addPlayer: () => void;
  removePlayer: (id: string) => void;
  renamePlayer: (id: string, name: string) => void;
  updateSettings: (patch: Partial<Settings>) => void;
  toggleCategory: (id: string) => void;
  setCategories: (ids: string[]) => void;
  resetPlayed: () => void;
  startGame: () => void;

  // round flow
  showCard: () => void;
  hideCard: () => void;
  startClock: () => void;
  pauseClock: () => void;
  resumeClock: () => void;
  goToVote: () => void;
  backToDiscuss: () => void;
  vote: (playerId: string | null) => void;
  continueVoting: () => void;
  resolveGuess: (correct: boolean) => void;
  nextRound: () => void;

  // scores + game
  adjustScore: (playerId: string, delta: number) => void;
  endGame: () => void;
  rematch: () => void;
  newSetup: () => void;
  toggleMuted: () => void;
  dismissNotice: () => void;
}

let idCounter = 0;
function makePlayer(index: number): Player {
  idCounter += 1;
  return {
    id: `p-${Date.now().toString(36)}-${idCounter}`,
    name: `Player ${index + 1}`,
  };
}

const defaultSettings: Settings = {
  imposters: 1,
  hint: "category",
  mode: "classic",
  troll: false,
  discussSeconds: 0,
  categories: DEFAULT_CATEGORY_IDS,
};

/** Most imposters a group can have and still be a fair fight. */
export function maxImposters(playerCount: number) {
  return Math.max(1, Math.floor((playerCount - 1) / 2));
}

// ------------------------------------------------------------------ helpers

export function playerName(state: Pick<ImposterState, "players">, id: string) {
  return state.players.find((p) => p.id === id)?.name ?? "Someone";
}

export function playerScore(
  state: Pick<ImposterState, "bonus" | "history">,
  id: string,
) {
  let score = state.bonus[id] ?? 0;
  for (const record of state.history) score += record.awards[id] ?? 0;
  return score;
}

/** Points each outcome gives, keyed by player id. */
export function roundAwards(
  players: Player[],
  imposterIds: string[],
  outcome: Outcome,
): Record<string, number> {
  const awards: Record<string, number> = {};
  const imposters = new Set(imposterIds);
  for (const p of players) {
    const isImposter = imposters.has(p.id);
    if (outcome === "crew" && !isImposter) awards[p.id] = 1;
    if (outcome === "imposters" && isImposter) awards[p.id] = 2;
    if (outcome === "steal" && isImposter) awards[p.id] = 1;
  }
  return awards;
}

export function dealer(state: Pick<ImposterState, "players" | "round">) {
  if (!state.round) return null;
  return state.players[state.round.dealIndex] ?? null;
}

/** Imposters still hiding this round. */
export function hiddenImposters(round: Round) {
  return round.imposterIds.filter((id) => !round.caught.includes(id));
}

function hintFor(word: ImposterWord, setting: HintSetting) {
  if (setting === "off") return null;
  if (setting === "hint" && word.hint) return word.hint;
  const category = imposterCategories.find((c) => c.id === word.categoryId);
  return category ? category.label : null;
}

/**
 * Picks the round's word, avoiding words already played. When every word in
 * the chosen categories has been played, those words are freed up again.
 */
function pickWord(state: ImposterState) {
  const pool = imposterPool(state.settings.categories);
  const playedSet = new Set(state.played);
  let fresh = pool.filter((w) => !playedSet.has(normalize(w.word)));
  let played = state.played;
  let notice: string | null = null;

  if (fresh.length === 0) {
    const poolKeys = new Set(pool.map((w) => normalize(w.word)));
    played = played.filter((w) => !poolKeys.has(w));
    fresh = pool;
    notice =
      "You've played every word in these categories, so the deck has been reshuffled.";
  }

  const word = fresh[Math.floor(Math.random() * fresh.length)];
  return {
    word,
    played: [...played, normalize(word.word)],
    notice,
  };
}

/** Other words from the same category, for undercover imposters. */
function decoys(word: ImposterWord, count: number) {
  const sameCategory = imposterPool([word.categoryId]).filter(
    (w) => normalize(w.word) !== normalize(word.word),
  );
  return shuffle(sameCategory).slice(0, count);
}

function dealRound(state: ImposterState): Partial<ImposterState> {
  const { players, settings } = state;
  const { word, played, notice } = pickWord(state);
  const troll = settings.troll && Math.random() < TROLL_CHANCE;
  const count = Math.min(settings.imposters, maxImposters(players.length));
  const imposterIds = troll
    ? players.map((p) => p.id)
    : shuffle(players)
        .slice(0, count)
        .map((p) => p.id);

  const cards: Record<string, Card> = {};
  if (settings.mode === "undercover") {
    // Undercover troll round: everyone gets a different word.
    const fakes = decoys(word, troll ? players.length : 1);
    for (const p of players) {
      if (!imposterIds.includes(p.id)) {
        cards[p.id] = { kind: "word", word: word.word };
      } else {
        const fake = troll
          ? fakes[players.indexOf(p) % Math.max(1, fakes.length)]
          : fakes[0];
        cards[p.id] = { kind: "word", word: fake?.word ?? word.word };
      }
    }
  } else {
    const hint = hintFor(word, settings.hint);
    for (const p of players) {
      cards[p.id] = imposterIds.includes(p.id)
        ? { kind: "imposter", hint }
        : { kind: "word", word: word.word };
    }
  }

  const starter = players[Math.floor(Math.random() * players.length)];

  return {
    phase: "pass",
    played,
    notice,
    round: {
      number: state.history.length + 1,
      word,
      imposterIds,
      troll,
      cards,
      dealIndex: 0,
      starterId: starter.id,
      caught: [],
      lastVotedId: null,
      outcome: null,
    },
    timer: { endsAt: null, remainingMs: settings.discussSeconds * 1000 },
  };
}

function finishRound(state: ImposterState, outcome: Outcome) {
  if (!state.round) return state;
  return {
    phase: "roundover" as const,
    round: { ...state.round, outcome },
    timer: { endsAt: null, remainingMs: 0 },
  };
}

// ------------------------------------------------------------------ store

export const useImposter = create<ImposterState>()(
  persist(
    (set, get) => ({
      phase: "setup",
      players: [0, 1, 2, 3].map(makePlayer),
      settings: defaultSettings,
      round: null,
      timer: { endsAt: null, remainingMs: 0 },
      bonus: {},
      history: [],
      played: [],
      notice: null,
      muted: false,

      addPlayer: () =>
        set((s) =>
          s.players.length >= MAX_PLAYERS
            ? s
            : { players: [...s.players, makePlayer(s.players.length)] },
        ),
      removePlayer: (id) =>
        set((s) => {
          if (s.players.length <= MIN_PLAYERS) return s;
          const players = s.players.filter((p) => p.id !== id);
          return {
            players,
            settings: {
              ...s.settings,
              imposters: Math.min(
                s.settings.imposters,
                maxImposters(players.length),
              ),
            },
          };
        }),
      renamePlayer: (id, name) =>
        set((s) => ({
          players: s.players.map((p) => (p.id === id ? { ...p, name } : p)),
        })),
      updateSettings: (patch) =>
        set((s) => ({ settings: { ...s.settings, ...patch } })),
      toggleCategory: (id) =>
        set((s) => {
          const has = s.settings.categories.includes(id);
          const categories = has
            ? s.settings.categories.filter((c) => c !== id)
            : [...s.settings.categories, id];
          return { settings: { ...s.settings, categories } };
        }),
      setCategories: (ids) =>
        set((s) => ({ settings: { ...s.settings, categories: ids } })),
      resetPlayed: () => set({ played: [] }),

      startGame: () => {
        const s = get();
        if (s.players.length < MIN_PLAYERS) return;
        if (s.settings.categories.length === 0) return;
        const players = s.players.map((p, i) => ({
          ...p,
          name: p.name.trim() || `Player ${i + 1}`,
        }));
        const next = { ...s, players, history: [], bonus: {} };
        set({ players, history: [], bonus: {}, ...dealRound(next) });
      },

      showCard: () => set((s) => (s.phase === "pass" ? { phase: "reveal" } : s)),
      hideCard: () =>
        set((s) => {
          if (s.phase !== "reveal" || !s.round) return s;
          const dealIndex = s.round.dealIndex + 1;
          const done = dealIndex >= s.players.length;
          return {
            phase: done ? "discuss" : "pass",
            round: { ...s.round, dealIndex },
          };
        }),
      startClock: () =>
        set((s) => ({
          timer: {
            endsAt: Date.now() + s.timer.remainingMs,
            remainingMs: s.timer.remainingMs,
          },
        })),
      pauseClock: () =>
        set((s) =>
          s.timer.endsAt === null
            ? s
            : {
                timer: {
                  endsAt: null,
                  remainingMs: Math.max(0, s.timer.endsAt - Date.now()),
                },
              },
        ),
      resumeClock: () => get().startClock(),
      goToVote: () =>
        set((s) => {
          const remainingMs = s.timer.endsAt
            ? Math.max(0, s.timer.endsAt - Date.now())
            : s.timer.remainingMs;
          return { phase: "vote", timer: { endsAt: null, remainingMs } };
        }),
      backToDiscuss: () =>
        set((s) => (s.phase === "vote" ? { phase: "discuss" } : s)),

      vote: (playerId) =>
        set((s) => {
          if (s.phase !== "vote" || !s.round) return s;
          // Nobody voted out: the imposters got away with it.
          if (!playerId) {
            return finishRound(s, s.round.troll ? "troll" : "imposters");
          }
          const isImposter = s.round.imposterIds.includes(playerId);
          const caught = isImposter
            ? [...s.round.caught, playerId]
            : s.round.caught;
          return {
            phase: "verdict",
            round: { ...s.round, caught, lastVotedId: playerId },
          };
        }),
      continueVoting: () =>
        set((s) => {
          if (s.phase !== "verdict" || !s.round) return s;
          const { round } = s;
          if (round.troll) return finishRound(s, "troll");
          const votedImposter =
            round.lastVotedId !== null &&
            round.imposterIds.includes(round.lastVotedId);
          if (!votedImposter) return finishRound(s, "imposters");
          if (hiddenImposters(round).length > 0) return { phase: "vote" };
          // Undercover imposters don't know the word, so there's no guess.
          if (s.settings.mode === "undercover") return finishRound(s, "crew");
          return { phase: "guess" };
        }),
      resolveGuess: (correct) =>
        set((s) =>
          s.phase === "guess" ? finishRound(s, correct ? "steal" : "crew") : s,
        ),

      nextRound: () =>
        set((s) => {
          if (s.phase !== "roundover" || !s.round?.outcome) return s;
          const record: RoundRecord = {
            number: s.round.number,
            word: s.round.word.word,
            categoryId: s.round.word.categoryId,
            imposterIds: s.round.imposterIds,
            outcome: s.round.outcome,
            awards: roundAwards(
              s.players,
              s.round.imposterIds,
              s.round.outcome,
            ),
          };
          const next = { ...s, history: [...s.history, record] };
          return { history: next.history, ...dealRound(next) };
        }),

      adjustScore: (playerId, delta) =>
        set((s) => ({
          bonus: { ...s.bonus, [playerId]: (s.bonus[playerId] ?? 0) + delta },
        })),
      endGame: () =>
        set((s) => {
          let history = s.history;
          // A finished round that hasn't been banked yet still counts.
          if (s.phase === "roundover" && s.round?.outcome) {
            history = [
              ...history,
              {
                number: s.round.number,
                word: s.round.word.word,
                categoryId: s.round.word.categoryId,
                imposterIds: s.round.imposterIds,
                outcome: s.round.outcome,
                awards: roundAwards(
                  s.players,
                  s.round.imposterIds,
                  s.round.outcome,
                ),
              },
            ];
          }
          return {
            phase: "gameover",
            history,
            round: null,
            timer: { endsAt: null, remainingMs: 0 },
          };
        }),
      rematch: () => get().startGame(),
      newSetup: () =>
        set({
          phase: "setup",
          round: null,
          history: [],
          bonus: {},
          notice: null,
        }),
      toggleMuted: () => set((s) => ({ muted: !s.muted })),
      dismissNotice: () => set({ notice: null }),
    }),
    {
      name: STORAGE_KEYS.imposter,
      version: 1,
      // Rehydrated manually after mount so server and client HTML match.
      skipHydration: true,
      partialize: (s) => ({
        phase: s.phase,
        players: s.players,
        settings: s.settings,
        round: s.round,
        timer: s.timer,
        bonus: s.bonus,
        history: s.history,
        played: s.played,
        muted: s.muted,
      }),
    },
  ),
);
