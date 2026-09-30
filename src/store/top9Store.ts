import { create } from "zustand";
import { persist } from "zustand/middleware";

import type { Tone } from "@/lib/games";
import { STORAGE_KEYS } from "@/lib/storageKeys";
import {
  categoryById,
  DEFAULT_CATEGORIES,
  questionCategories,
} from "@/lib/top9/categories";
import { dealDeck } from "@/lib/top9/deal";
import { originalQuestions } from "@/lib/top9/originals";
import type { Top9Question } from "@/lib/top9/types";

export const MAX_STRIKES = 3;
/** Host's per-round category choice: a category id, or a mix of all chosen. */
export const MIX = "mix";

export type Top9Phase =
  "setup" | "intro" | "faceoff" | "play" | "steal" | "roundEnd" | "gameover";

/** host: someone holds the phone and sees the answers. typed: nobody does. */
export type HostMode = "host" | "typed";

export interface Top9Team {
  name: string;
  tone: Tone;
  score: number;
}

export interface Top9Settings {
  rounds: number;
  mode: HostMode;
  doubleFinal: boolean;
  /** Categories questions are dealt from. */
  categories: string[];
}

export interface RoundRecord {
  questionId: string;
  prompt: string;
  winner: number | null;
  points: number;
}

/** Everything a reveal/strike can change, so it can be undone. */
interface RoundSnapshot {
  phase: Top9Phase;
  revealed: number[];
  pot: number;
  strikes: number;
  control: number | null;
  roundWinner: number | null;
  teams: Top9Team[];
}

interface Top9State {
  phase: Top9Phase;
  teams: Top9Team[];
  settings: Top9Settings;
  /** Questions dealt for this game, not yet played. */
  deck: Top9Question[];
  question: Top9Question | null;
  /** The host's category choice for the next question (sticky). */
  pick: string;
  /** Question ids already played, across games, so boards don't repeat. */
  used: string[];
  round: number;
  revealed: number[];
  pot: number;
  strikes: number;
  control: number | null;
  roundWinner: number | null;
  history: RoundRecord[];
  undoStack: RoundSnapshot[];
  muted: boolean;
  /** Host mode only: whether hidden answers are shown on the host's screen. */
  hostView: boolean;
  /** Fetching questions. Not persisted. */
  loading: boolean;
  /** One-off message for the host (offline fallback, category ran dry…). */
  notice: string | null;

  renameTeam: (index: number, name: string) => void;
  updateSettings: (patch: Partial<Top9Settings>) => void;
  toggleCategory: (id: string) => void;
  setCategories: (ids: string[]) => void;
  resetUsed: () => void;
  startGame: () => Promise<void>;
  pickCategory: (id: string) => Promise<void>;
  skipQuestion: () => Promise<void>;
  startFaceoff: () => void;
  reveal: (index: number) => void;
  strike: () => void;
  giveControl: (team: number) => void;
  stealFailed: () => void;
  revealRest: () => void;
  nextRound: () => Promise<void>;
  undo: () => void;
  adjustScore: (team: number, delta: number) => void;
  endGame: () => void;
  rematch: () => Promise<void>;
  newSetup: () => void;
  toggleMuted: () => void;
  toggleHostView: () => void;
  dismissNotice: () => void;
}

const defaultTeams: Top9Team[] = [
  { name: "Blue Whales", tone: "blue", score: 0 },
  { name: "Red Rockets", tone: "red", score: 0 },
];

const defaultSettings: Top9Settings = {
  rounds: 5,
  mode: "host",
  doubleFinal: true,
  categories: DEFAULT_CATEGORIES,
};

// ------------------------------------------------------------------ helpers

export function isFinalRound(state: Pick<Top9State, "round" | "settings">) {
  return state.round === state.settings.rounds - 1;
}

export function multiplier(state: Pick<Top9State, "round" | "settings">) {
  return state.settings.doubleFinal && isFinalRound(state) ? 2 : 1;
}

export function otherTeam(team: number) {
  return team === 0 ? 1 : 0;
}

function categoryLabel(id: string) {
  return id === MIX ? "the mix" : (categoryById(id)?.label ?? id);
}

/**
 * Deals questions from the server's full bank, falling back to the built-in
 * originals when offline.
 */
async function fetchDeck(
  categories: string[],
  exclude: string[],
  perCategory: number,
) {
  try {
    const res = await fetch("/api/games/top-9", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ categories, exclude, perCategory }),
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) throw new Error(`Deck request failed (${res.status})`);
    const data = (await res.json()) as { deck: Top9Question[] };
    return { deck: data.deck, offline: false };
  } catch {
    const { deck } = dealDeck(originalQuestions, {
      categories,
      exclude,
      perCategory,
    });
    return { deck, offline: true };
  }
}

/**
 * Takes the next question for `pick` from the deck. For the mix, prefers a
 * category that differs from the last question so rounds feel varied.
 */
function takeQuestion(
  deck: Top9Question[],
  pick: string,
  last: Top9Question | null,
) {
  const matches = deck.filter(
    (q) =>
      q.id !== last?.id &&
      (pick === MIX || questionCategories(q).includes(pick)),
  );
  if (!matches.length) return null;
  const lastCats = last ? questionCategories(last) : [];
  const question =
    (pick === MIX &&
      matches.find(
        (q) => !questionCategories(q).some((c) => lastCats.includes(c)),
      )) ||
    matches[0];
  return { question, deck: deck.filter((q) => q.id !== question.id) };
}

function snapshot(s: Top9State): RoundSnapshot {
  return {
    phase: s.phase,
    revealed: s.revealed,
    pot: s.pot,
    strikes: s.strikes,
    control: s.control,
    roundWinner: s.roundWinner,
    teams: s.teams,
  };
}

function pushUndo(s: Top9State) {
  return [...s.undoStack, snapshot(s)].slice(-20);
}

/** Close the round: bank the pot (with multiplier) for the winner. */
function finishRound(
  s: Top9State,
  winner: number | null,
  revealed: number[],
  pot: number,
) {
  const points = winner === null ? 0 : pot * multiplier(s);
  return {
    phase: "roundEnd" as const,
    revealed,
    pot,
    roundWinner: winner,
    teams: s.teams.map((t, i) =>
      i === winner ? { ...t, score: t.score + points } : t,
    ),
  };
}

const freshRound = {
  revealed: [] as number[],
  pot: 0,
  strikes: 0,
  control: null,
  roundWinner: null,
  undoStack: [] as RoundSnapshot[],
};

// ------------------------------------------------------------------ store

export const useTop9 = create<Top9State>()(
  persist(
    (set, get) => {
      /**
       * Puts the next question on the board for `pick`, topping the deck up
       * from the server when that category has run dry. `putBack` returns the
       * current question to the deck (the host switched category).
       */
      async function loadQuestion(pick: string, { putBack = false } = {}) {
        const s = get();
        if (s.loading) return false;
        let deck = s.deck;
        let used = s.used;
        const current = s.question;
        if (putBack && current) {
          deck = [...deck, current];
          used = used.filter((id) => id !== current.id);
        }

        let taken = takeQuestion(deck, pick, current);
        let offline = false;
        if (!taken) {
          set({ loading: true });
          const categories = pick === MIX ? s.settings.categories : [pick];
          const known = [
            ...used,
            ...deck.map((q) => q.id),
            ...(current ? [current.id] : []),
          ];
          const refill = await fetchDeck(
            categories,
            known,
            pick === MIX ? 3 : 6,
          );
          offline = refill.offline;
          const inDeck = new Set(deck.map((q) => q.id));
          deck = [...deck, ...refill.deck.filter((q) => !inDeck.has(q.id))];
          taken = takeQuestion(deck, pick, current);
        }

        if (!taken) {
          set({
            loading: false,
            deck,
            notice: `No more questions in ${categoryLabel(pick)}. Pick another category.`,
          });
          return false;
        }

        set({
          loading: false,
          phase: "intro",
          pick,
          question: taken.question,
          deck: taken.deck,
          used: [
            ...used.filter((id) => id !== taken.question.id),
            taken.question.id,
          ],
          notice: offline
            ? "Couldn't reach the question library, so this board is from the built-in pack."
            : null,
          ...freshRound,
        });
        return true;
      }

      async function beginGame() {
        const s = get();
        if (s.loading || s.settings.categories.length === 0) return;
        set({ loading: true, notice: null });
        const { categories, rounds } = s.settings;
        const perCategory = Math.min(
          15,
          categories.length === 1 ? rounds + 6 : Math.max(3, rounds),
        );
        const { deck, offline } = await fetchDeck(
          categories,
          s.used,
          perCategory,
        );
        set({
          loading: false,
          deck,
          question: null,
          pick: MIX,
          round: 0,
          history: [],
          teams: get().teams.map((t, i) => ({
            ...t,
            name: t.name.trim() || defaultTeams[i].name,
            score: 0,
          })),
          ...freshRound,
        });
        const ok = await loadQuestion(MIX);
        if (ok && offline) {
          set({
            notice:
              "Couldn't reach the question library, so you're playing the built-in pack for now.",
          });
        }
      }

      return {
        phase: "setup",
        teams: defaultTeams,
        settings: defaultSettings,
        deck: [],
        question: null,
        pick: MIX,
        used: [],
        round: 0,
        ...freshRound,
        history: [],
        muted: false,
        hostView: true,
        loading: false,
        notice: null,

        renameTeam: (index, name) =>
          set((s) => ({
            teams: s.teams.map((t, i) => (i === index ? { ...t, name } : t)),
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
        resetUsed: () => set({ used: [] }),

        startGame: beginGame,
        rematch: beginGame,

        pickCategory: async (id) => {
          if (get().phase !== "intro" || id === get().pick) return;
          await loadQuestion(id, { putBack: true });
        },
        skipQuestion: async () => {
          if (get().phase !== "intro") return;
          await loadQuestion(get().pick);
        },

        startFaceoff: () => set({ phase: "faceoff" }),

        reveal: (index) =>
          set((s) => {
            const question = s.question;
            if (!question || s.revealed.includes(index)) return s;
            const answer = question.answers[index];
            if (!answer) return s;
            const revealed = [...s.revealed, index];

            // After the round, reveals are just for show and don't score.
            if (s.phase === "roundEnd") return { revealed };

            const pot = s.pot + answer.points;
            const undoStack = pushUndo(s);

            if (s.phase === "steal" && s.control !== null) {
              return {
                ...finishRound(s, otherTeam(s.control), revealed, pot),
                undoStack,
              };
            }
            if (
              s.phase === "play" &&
              revealed.length === question.answers.length
            ) {
              return { ...finishRound(s, s.control, revealed, pot), undoStack };
            }
            return { revealed, pot, undoStack };
          }),

        strike: () =>
          set((s) => {
            if (s.phase !== "play") return s;
            const strikes = s.strikes + 1;
            return {
              strikes,
              phase: strikes >= MAX_STRIKES ? "steal" : "play",
              undoStack: pushUndo(s),
            };
          }),

        giveControl: (team) =>
          set((s) => {
            if (s.phase !== "faceoff") return s;
            // Face-off already cleared the board: control team wins it outright.
            if (s.question && s.revealed.length === s.question.answers.length) {
              return {
                ...finishRound(
                  { ...s, control: team },
                  team,
                  s.revealed,
                  s.pot,
                ),
                control: team,
                undoStack: pushUndo(s),
              };
            }
            return { phase: "play", control: team, undoStack: pushUndo(s) };
          }),

        stealFailed: () =>
          set((s) => {
            if (s.phase !== "steal") return s;
            return {
              ...finishRound(s, s.control, s.revealed, s.pot),
              undoStack: pushUndo(s),
            };
          }),

        revealRest: () =>
          set((s) => {
            if (!s.question || s.phase !== "roundEnd") return s;
            const rest = s.question.answers
              .map((_, i) => i)
              .filter((i) => !s.revealed.includes(i));
            return { revealed: [...s.revealed, ...rest] };
          }),

        nextRound: async () => {
          const s = get();
          if (s.phase !== "roundEnd" || s.loading) return;
          const record: RoundRecord = {
            questionId: s.question?.id ?? "",
            prompt: s.question?.prompt ?? "",
            winner: s.roundWinner,
            points: s.roundWinner === null ? 0 : s.pot * multiplier(s),
          };
          const round = s.round + 1;
          const history = [...s.history, record];
          if (round >= s.settings.rounds) {
            set({ phase: "gameover", history, round, undoStack: [] });
            return;
          }
          set({ round, history });
          const ok = await loadQuestion(s.pick);
          // The chosen category ran dry: fall back to the mix.
          if (!ok && s.pick !== MIX) await loadQuestion(MIX);
        },

        undo: () =>
          set((s) => {
            const previous = s.undoStack.at(-1);
            if (!previous) return s;
            return { ...previous, undoStack: s.undoStack.slice(0, -1) };
          }),

        adjustScore: (team, delta) =>
          set((s) => ({
            teams: s.teams.map((t, i) =>
              i === team ? { ...t, score: Math.max(0, t.score + delta) } : t,
            ),
          })),

        endGame: () => set({ phase: "gameover", undoStack: [] }),
        newSetup: () =>
          set((s) => ({
            phase: "setup",
            teams: s.teams.map((t) => ({ ...t, score: 0 })),
            round: 0,
            history: [],
            deck: [],
            question: null,
            notice: null,
            ...freshRound,
          })),
        toggleMuted: () => set((s) => ({ muted: !s.muted })),
        toggleHostView: () => set((s) => ({ hostView: !s.hostView })),
        dismissNotice: () => set({ notice: null }),
      };
    },
    {
      name: STORAGE_KEYS.top9,
      version: 2,
      skipHydration: true,
      // Loading flags and one-off notices shouldn't survive a refresh.
      partialize: (s) =>
        Object.fromEntries(
          Object.entries(s).filter(
            ([key]) => key !== "loading" && key !== "notice",
          ),
        ) as Partial<Top9State>,
      migrate: (persisted, version) => {
        const old = (persisted ?? {}) as Partial<Top9State>;
        if (version < 2) {
          // v1 kept question ids for a small built-in bank; start fresh.
          return {
            phase: "setup",
            teams: (old.teams ?? defaultTeams).map((t) => ({ ...t, score: 0 })),
            settings: {
              ...defaultSettings,
              ...old.settings,
              categories: DEFAULT_CATEGORIES,
            },
            muted: old.muted ?? false,
            hostView: old.hostView ?? true,
          } as Top9State;
        }
        return old as Top9State;
      },
    },
  ),
);
