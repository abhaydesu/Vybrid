import { create } from "zustand";
import { persist } from "zustand/middleware";

import {
  buildPool,
  CUSTOM_ID,
  normalize,
  shuffle,
  type CharadesCard,
  type LevelSetting,
} from "@/lib/charades/words";
import type { Tone } from "@/lib/games";
import { STORAGE_KEYS } from "@/lib/storageKeys";

export const HAND_SIZE = 3;
export const MAX_TEAMS = 4;
/** What the classic game plays by default: movies. */
export const MOVIE_CATEGORIES = ["bollywood", "hollywood", "south"];

export type Phase =
  | "setup"
  /** The picking team takes the phone. */
  | "handoff"
  | "choose"
  /** A movie is chosen; the phone goes over to the actor. */
  | "pass"
  | "ready"
  | "acting"
  | "result"
  | "gameover";

export type Outcome = "guessed" | "gaveup";

export interface Team {
  id: string;
  name: string;
  tone: Tone;
  players: string[];
  /** Manual score corrections from the scoreboard. */
  bonus: number;
}

export interface Settings {
  turnsPerTeam: number;
  difficulty: LevelSetting;
  categories: string[];
  /** Minutes before a gentle "give up?" nudge; null = never. */
  nudgeMinutes: number | null;
  /** The team that picked the movie scores when the actor's team gives up. */
  stumpPoint: boolean;
  customWords: string[];
}

export interface TurnRecord {
  teamId: string;
  actor: string | null;
  pickedBy: string;
  word: string;
  custom: boolean;
  outcome: Outcome;
  seconds: number;
  /** Who got the point, if anyone. */
  winner: string | null;
}

/** A stopwatch: counts up while `startedAt` is set. */
interface Clock {
  startedAt: number | null;
  elapsedMs: number;
}

interface DumbCharadesState {
  phase: Phase;
  teams: Team[];
  settings: Settings;
  turn: number;
  deck: CharadesCard[];
  hand: CharadesCard[];
  word: CharadesCard | null;
  clock: Clock;
  outcome: Outcome | null;
  history: TurnRecord[];
  /** Movies already picked, across games, so they don't repeat. */
  played: string[];
  notice: string | null;
  muted: boolean;

  // setup
  addTeam: () => void;
  removeTeam: (id: string) => void;
  renameTeam: (id: string, name: string) => void;
  setPlayers: (id: string, players: string[]) => void;
  updateSettings: (patch: Partial<Settings>) => void;
  toggleCategory: (id: string) => void;
  setCategories: (ids: string[]) => void;
  setCustomWords: (words: string[]) => void;
  resetPlayed: () => void;
  startGame: () => void;

  // turn flow
  revealHand: () => void;
  shuffleHand: () => void;
  chooseWord: (card: CharadesCard) => void;
  writeWord: (word: string) => void;
  backToHand: () => void;
  showWordToActor: () => void;
  startClock: () => void;
  pauseClock: () => void;
  resumeClock: () => void;
  finish: (outcome: Outcome) => void;
  setOutcome: (outcome: Outcome) => void;
  nextTurn: () => void;

  // scores + game
  adjustScore: (teamId: string, delta: number) => void;
  endGame: () => void;
  rematch: () => void;
  newSetup: () => void;
  toggleMuted: () => void;
  dismissNotice: () => void;
}

const TEAM_PRESETS: Array<{ name: string; tone: Tone }> = [
  { name: "Blue Whales", tone: "blue" },
  { name: "Red Rockets", tone: "red" },
  { name: "Green Geckos", tone: "green" },
  { name: "Yellow Yetis", tone: "yellow" },
];

function makeTeam(index: number): Team {
  const preset = TEAM_PRESETS[index % TEAM_PRESETS.length];
  return {
    id: `${preset.tone}-${Date.now().toString(36)}-${index}`,
    name: preset.name,
    tone: preset.tone,
    players: [],
    bonus: 0,
  };
}

const defaultSettings: Settings = {
  turnsPerTeam: 3,
  difficulty: "mix",
  categories: MOVIE_CATEGORIES,
  nudgeMinutes: 3,
  stumpPoint: false,
  customWords: [],
};

// ------------------------------------------------------------------ helpers

export function currentTeam(state: Pick<DumbCharadesState, "teams" | "turn">) {
  return state.teams[state.turn % Math.max(1, state.teams.length)];
}

export function currentRound(state: Pick<DumbCharadesState, "teams" | "turn">) {
  return Math.floor(state.turn / Math.max(1, state.teams.length)) + 1;
}

/** Who acts this turn, rotating through the team's players. */
export function currentActor(state: Pick<DumbCharadesState, "teams" | "turn">) {
  const team = currentTeam(state);
  if (!team || team.players.length === 0) return null;
  return team.players[(currentRound(state) - 1) % team.players.length];
}

/** The team choosing this turn's movie: the next one round the circle. */
export function pickingTeam(state: Pick<DumbCharadesState, "teams" | "turn">) {
  return state.teams[(state.turn + 1) % Math.max(1, state.teams.length)];
}

export const totalTurns = (s: Pick<DumbCharadesState, "teams" | "settings">) =>
  s.teams.length * s.settings.turnsPerTeam;

export function elapsedMs(clock: Clock, now = Date.now()) {
  return clock.elapsedMs + (clock.startedAt === null ? 0 : now - clock.startedAt);
}

export function teamScore(team: Team, history: TurnRecord[]) {
  return team.bonus + history.filter((r) => r.winner === team.id).length;
}

function winnerOf(
  s: Pick<DumbCharadesState, "teams" | "turn" | "settings">,
  outcome: Outcome,
) {
  if (outcome === "guessed") return currentTeam(s).id;
  return s.settings.stumpPoint ? pickingTeam(s).id : null;
}

/** The team that would get the point if the result is confirmed now. */
export function pendingWinner(s: DumbCharadesState): string | null {
  if (s.phase !== "result" || !s.outcome) return null;
  return winnerOf(s, s.outcome);
}

/**
 * Deals a fresh hand, rebuilding the deck when it runs low. When every movie
 * in the chosen categories has been picked, those are freed up again so the
 * game can keep going.
 */
function dealHand(state: DumbCharadesState, exclude: CharadesCard[] = []) {
  let { deck, played } = state;
  let notice: string | null = null;
  const excluded = new Set(exclude.map((c) => normalize(c.word)));

  if (deck.length < HAND_SIZE) {
    const pool = buildPool(state.settings);
    const playedSet = new Set(played);
    let fresh = pool.filter(
      (c) => !playedSet.has(normalize(c.word)) && !excluded.has(normalize(c.word)),
    );
    if (fresh.length < HAND_SIZE) {
      const keys = new Set(pool.map((c) => normalize(c.word)));
      played = played.filter((w) => !keys.has(w));
      fresh = pool.filter((c) => !excluded.has(normalize(c.word)));
      notice = "You've used every title in these categories, so the deck has been reshuffled.";
    }
    const left = new Set(deck.map((c) => normalize(c.word)));
    deck = [...deck, ...shuffle(fresh.filter((c) => !left.has(normalize(c.word))))];
  }

  return { hand: deck.slice(0, HAND_SIZE), deck: deck.slice(HAND_SIZE), played, notice };
}

const freshRound = {
  hand: [] as CharadesCard[],
  word: null as CharadesCard | null,
  clock: { startedAt: null, elapsedMs: 0 } as Clock,
  outcome: null as Outcome | null,
};

// ------------------------------------------------------------------ store

export const useDumbCharades = create<DumbCharadesState>()(
  persist(
    (set, get) => ({
      phase: "setup",
      teams: [makeTeam(0), makeTeam(1)],
      settings: defaultSettings,
      turn: 0,
      deck: [],
      ...freshRound,
      history: [],
      played: [],
      notice: null,
      muted: false,

      addTeam: () =>
        set((s) => {
          if (s.teams.length >= MAX_TEAMS) return s;
          const used = new Set(s.teams.map((t) => t.tone));
          const index = TEAM_PRESETS.findIndex((p) => !used.has(p.tone));
          return { teams: [...s.teams, makeTeam(index === -1 ? s.teams.length : index)] };
        }),
      removeTeam: (id) =>
        set((s) => (s.teams.length <= 2 ? s : { teams: s.teams.filter((t) => t.id !== id) })),
      renameTeam: (id, name) =>
        set((s) => ({ teams: s.teams.map((t) => (t.id === id ? { ...t, name } : t)) })),
      setPlayers: (id, players) =>
        set((s) => ({ teams: s.teams.map((t) => (t.id === id ? { ...t, players } : t)) })),
      updateSettings: (patch) =>
        set((s) => ({ settings: { ...s.settings, ...patch }, deck: [] })),
      toggleCategory: (id) =>
        set((s) => {
          const has = s.settings.categories.includes(id);
          if (has && s.settings.categories.length === 1) return s;
          const categories = has
            ? s.settings.categories.filter((c) => c !== id)
            : [...s.settings.categories, id];
          return { settings: { ...s.settings, categories }, deck: [] };
        }),
      setCategories: (ids) =>
        set((s) => ({ settings: { ...s.settings, categories: ids }, deck: [] })),
      setCustomWords: (words) =>
        set((s) => {
          const customWords = [...new Set(words.map((w) => w.trim()).filter(Boolean))].slice(0, 100);
          const others = s.settings.categories.filter((c) => c !== CUSTOM_ID);
          const categories = customWords.length
            ? [...others, CUSTOM_ID]
            : others.length
              ? others
              : MOVIE_CATEGORIES;
          return { settings: { ...s.settings, customWords, categories }, deck: [] };
        }),
      resetPlayed: () => set({ played: [], deck: [] }),

      startGame: () => {
        const s = get();
        if (s.settings.categories.length === 0) return;
        set({
          phase: "handoff",
          teams: s.teams.map((t, i) => ({
            ...t,
            name: t.name.trim() || TEAM_PRESETS[i % TEAM_PRESETS.length].name,
            bonus: 0,
          })),
          turn: 0,
          history: [],
          deck: [],
          ...freshRound,
          notice: null,
        });
      },

      revealHand: () =>
        set((s) => {
          if (s.hand.length === HAND_SIZE) return { phase: "choose" };
          return { phase: "choose", ...dealHand(s) };
        }),
      shuffleHand: () =>
        set((s) => {
          // Skipped cards go to the bottom of the deck: seen, but not picked.
          const dealt = dealHand(s, s.hand);
          return { ...dealt, deck: [...dealt.deck, ...s.hand] };
        }),
      chooseWord: (card) =>
        set((s) => {
          const key = normalize(card.word);
          const isCustom = card.categoryId === CUSTOM_ID;
          return {
            phase: "pass",
            word: card,
            played: isCustom ? s.played : [...s.played.filter((w) => w !== key), key],
            clock: { startedAt: null, elapsedMs: 0 },
          };
        }),
      writeWord: (text) => {
        const word = text.trim().replace(/\s+/g, " ");
        if (!word) return;
        // Written-in titles are tagged custom so they never count as "played".
        get().chooseWord({ word, categoryId: "written", level: "custom" });
      },
      backToHand: () =>
        set((s) => ({
          phase: "choose",
          played: s.word ? s.played.filter((w) => w !== normalize(s.word!.word)) : s.played,
          word: null,
        })),
      showWordToActor: () => set((s) => (s.phase === "pass" ? { phase: "ready" } : s)),

      startClock: () =>
        set((s) => ({
          phase: "acting",
          clock: { startedAt: Date.now(), elapsedMs: s.clock.elapsedMs },
        })),
      pauseClock: () =>
        set((s) =>
          s.clock.startedAt === null
            ? s
            : { clock: { startedAt: null, elapsedMs: elapsedMs(s.clock) } },
        ),
      resumeClock: () =>
        set((s) =>
          s.clock.startedAt !== null
            ? s
            : { clock: { startedAt: Date.now(), elapsedMs: s.clock.elapsedMs } },
        ),

      finish: (outcome) =>
        set((s) => {
          if (s.phase !== "acting") return s;
          return {
            phase: "result",
            outcome,
            clock: { startedAt: null, elapsedMs: elapsedMs(s.clock) },
          };
        }),
      setOutcome: (outcome) => set({ outcome }),

      nextTurn: () =>
        set((s) => {
          if (s.phase !== "result" || !s.word || !s.outcome) return s;
          const team = currentTeam(s);
          const record: TurnRecord = {
            teamId: team.id,
            actor: currentActor(s),
            pickedBy: pickingTeam(s).id,
            word: s.word.word,
            custom: s.word.categoryId === "written" || s.word.categoryId === CUSTOM_ID,
            outcome: s.outcome,
            seconds: Math.round(s.clock.elapsedMs / 1000),
            winner: winnerOf(s, s.outcome),
          };
          const turn = s.turn + 1;
          const over = turn >= totalTurns(s);
          return {
            history: [...s.history, record],
            turn,
            phase: over ? "gameover" : "handoff",
            ...freshRound,
            notice: null,
          };
        }),

      adjustScore: (teamId, delta) =>
        set((s) => ({
          teams: s.teams.map((t) => (t.id === teamId ? { ...t, bonus: t.bonus + delta } : t)),
        })),
      endGame: () => {
        // A finished-but-unconfirmed turn still counts; one still being acted doesn't.
        if (get().phase === "result") get().nextTurn();
        set({ phase: "gameover", ...freshRound });
      },
      rematch: () => get().startGame(),
      newSetup: () =>
        set((s) => ({
          phase: "setup",
          teams: s.teams.map((t) => ({ ...t, bonus: 0 })),
          history: [],
          turn: 0,
          ...freshRound,
          notice: null,
        })),
      toggleMuted: () => set((s) => ({ muted: !s.muted })),
      dismissNotice: () => set({ notice: null }),
    }),
    {
      name: STORAGE_KEYS.dumbCharades,
      version: 1,
      // Rehydrated manually after mount so server and client HTML match.
      skipHydration: true,
      partialize: (s) => ({
        phase: s.phase,
        teams: s.teams,
        settings: s.settings,
        turn: s.turn,
        deck: s.deck,
        hand: s.hand,
        word: s.word,
        clock: s.clock,
        outcome: s.outcome,
        history: s.history,
        played: s.played,
        muted: s.muted,
      }),
    },
  ),
);
