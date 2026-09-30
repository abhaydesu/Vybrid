import { create } from "zustand";
import { persist } from "zustand/middleware";

import type { Tone } from "@/lib/games";
import { STORAGE_KEYS } from "@/lib/storageKeys";
import {
  buildPool,
  normalize,
  shuffle,
  type DifficultySetting,
  type WordCard,
} from "@/lib/words/deck";
import {
  CUSTOM_CATEGORY_ID,
  pictionaryCategories,
  THEME_CATEGORY_ID,
} from "@/lib/words/pictionary";

export const HAND_SIZE = 3;
export const MAX_TEAMS = 4;

export type Phase =
  | "setup"
  | "handoff"
  | "choose"
  /** Opponents picked; phone goes over to the drawer. */
  | "pass"
  | "ready"
  | "drawing"
  | "result"
  | "gameover";

export type Outcome = "guessed" | "timeout" | "passed";

/** Who chooses the word: the other team (classic) or the drawer. */
export type PickerMode = "opponents" | "drawer";

export interface Team {
  id: string;
  name: string;
  tone: Tone;
  players: string[];
  /** Manual score corrections from the scoreboard. */
  bonus: number;
}

export interface Settings {
  roundSeconds: number;
  turnsPerTeam: number;
  difficulty: DifficultySetting;
  categories: string[];
  steals: boolean;
  picker: PickerMode;
}

export interface TurnRecord {
  teamId: string;
  drawer: string | null;
  /** Team that picked the word, when opponents pick. */
  pickedBy?: string | null;
  custom?: boolean;
  word: string;
  outcome: Outcome;
  stolenBy: string | null;
}

interface Timer {
  /** Epoch ms when the clock hits zero; null while paused / not started. */
  endsAt: number | null;
  remainingMs: number;
}

interface PictionaryState {
  phase: Phase;
  teams: Team[];
  settings: Settings;
  theme: { name: string; words: string[] } | null;
  turn: number;
  deck: WordCard[];
  hand: WordCard[];
  word: WordCard | null;
  timer: Timer;
  outcome: Outcome | null;
  /** undefined = steal question not answered yet, null = nobody. */
  stolenBy: string | null | undefined;
  history: TurnRecord[];
  /** Words actually chosen to draw, across games, so they don't repeat. */
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
  setTheme: (theme: { name: string; words: string[] } | null) => void;
  resetPlayed: () => void;
  startGame: () => void;

  // turn flow
  revealHand: () => void;
  shuffleHand: () => void;
  chooseWord: (card: WordCard) => void;
  writeWord: (word: string) => void;
  showWordToDrawer: () => void;
  backToHand: () => void;
  startClock: () => void;
  pauseClock: () => void;
  resumeClock: () => void;
  endTurn: (outcome: Outcome) => void;
  setOutcome: (outcome: Outcome) => void;
  setStolenBy: (teamId: string | null) => void;
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
  roundSeconds: 60,
  turnsPerTeam: 3,
  difficulty: "mix",
  categories: pictionaryCategories.map((c) => c.id),
  steals: true,
  picker: "opponents",
};

// ------------------------------------------------------------------ helpers

export function currentTeam(state: Pick<PictionaryState, "teams" | "turn">) {
  return state.teams[state.turn % Math.max(1, state.teams.length)];
}

export function currentRound(state: Pick<PictionaryState, "teams" | "turn">) {
  return Math.floor(state.turn / Math.max(1, state.teams.length)) + 1;
}

export function currentDrawer(state: Pick<PictionaryState, "teams" | "turn">) {
  const team = currentTeam(state);
  if (!team || team.players.length === 0) return null;
  return team.players[(currentRound(state) - 1) % team.players.length];
}

/** The team choosing this turn's word. */
export function pickingTeam(
  state: Pick<PictionaryState, "teams" | "turn" | "settings">,
) {
  if (state.settings.picker === "drawer") return currentTeam(state);
  return state.teams[(state.turn + 1) % Math.max(1, state.teams.length)];
}

/**
 * Teams allowed to steal a missed word. Never the drawing team, and never the
 * team that picked the word, since they already know it.
 */
export function stealCandidates(
  state: Pick<PictionaryState, "teams" | "turn" | "settings">,
) {
  if (!state.settings.steals) return [];
  const drawing = currentTeam(state);
  const picker =
    state.settings.picker === "opponents" ? pickingTeam(state) : null;
  return state.teams.filter((t) => t.id !== drawing?.id && t.id !== picker?.id);
}

/** Points a turn gives, as [teamId, points] pairs. */
function turnAwards(
  record: Pick<TurnRecord, "teamId" | "outcome" | "stolenBy">,
) {
  if (record.outcome === "guessed") return [record.teamId];
  return record.stolenBy ? [record.stolenBy] : [];
}

export function teamScore(team: Team, history: TurnRecord[]) {
  let score = team.bonus;
  for (const record of history) {
    for (const id of turnAwards(record)) if (id === team.id) score += 1;
  }
  return score;
}

/** Points the in-progress result screen will award when "Next turn" is hit. */
export function pendingAward(state: PictionaryState): string | null {
  if (state.phase !== "result" || !state.outcome) return null;
  const team = currentTeam(state);
  if (state.outcome === "guessed") return team?.id ?? null;
  return state.stolenBy ?? null;
}

/**
 * Deals a fresh hand from the deck, rebuilding the deck when it runs low.
 * When every word matching the settings has been played, the played list for
 * those words is cleared so the game can keep going.
 */
function dealHand(state: PictionaryState, exclude: WordCard[] = []) {
  let { deck, played } = state;
  let notice: string | null = null;
  const excluded = new Set(exclude.map((c) => normalize(c.word)));

  if (deck.length < HAND_SIZE) {
    const pool = buildPool({ ...state.settings, theme: state.theme });
    const playedSet = new Set(played);
    let fresh = pool.filter(
      (c) =>
        !playedSet.has(normalize(c.word)) && !excluded.has(normalize(c.word)),
    );

    if (fresh.length < HAND_SIZE) {
      const poolKeys = new Set(pool.map((c) => normalize(c.word)));
      played = played.filter((w) => !poolKeys.has(w));
      fresh = pool.filter((c) => !excluded.has(normalize(c.word)));
      notice =
        "You've drawn every word in these categories, so the deck has been reshuffled.";
    }

    // Keep whatever was left in the old deck at the front.
    const leftover = new Set(deck.map((c) => normalize(c.word)));
    deck = [
      ...deck,
      ...shuffle(fresh.filter((c) => !leftover.has(normalize(c.word)))),
    ];
  }

  return {
    hand: deck.slice(0, HAND_SIZE),
    deck: deck.slice(HAND_SIZE),
    played,
    notice,
  };
}

// ------------------------------------------------------------------ store

export const usePictionary = create<PictionaryState>()(
  persist(
    (set, get) => ({
      phase: "setup",
      teams: [makeTeam(0), makeTeam(1)],
      settings: defaultSettings,
      theme: null,
      turn: 0,
      deck: [],
      hand: [],
      word: null,
      timer: { endsAt: null, remainingMs: 0 },
      outcome: null,
      stolenBy: undefined,
      history: [],
      played: [],
      notice: null,
      muted: false,

      addTeam: () =>
        set((s) => {
          if (s.teams.length >= MAX_TEAMS) return s;
          const usedTones = new Set(s.teams.map((t) => t.tone));
          const index = TEAM_PRESETS.findIndex((p) => !usedTones.has(p.tone));
          return {
            teams: [
              ...s.teams,
              makeTeam(index === -1 ? s.teams.length : index),
            ],
          };
        }),
      removeTeam: (id) =>
        set((s) =>
          s.teams.length <= 2
            ? s
            : { teams: s.teams.filter((t) => t.id !== id) },
        ),
      renameTeam: (id, name) =>
        set((s) => ({
          teams: s.teams.map((t) => (t.id === id ? { ...t, name } : t)),
        })),
      setPlayers: (id, players) =>
        set((s) => ({
          teams: s.teams.map((t) => (t.id === id ? { ...t, players } : t)),
        })),
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
      setTheme: (theme) =>
        set((s) => {
          const others = s.settings.categories.filter(
            (c) => c !== THEME_CATEGORY_ID,
          );
          const categories = theme
            ? [...others, THEME_CATEGORY_ID]
            : others.length
              ? others
              : defaultSettings.categories;
          return { theme, settings: { ...s.settings, categories }, deck: [] };
        }),
      resetPlayed: () => set({ played: [], deck: [] }),

      startGame: () =>
        set((s) => ({
          phase: "handoff",
          teams: s.teams.map((t, i) => ({
            ...t,
            name: t.name.trim() || TEAM_PRESETS[i % TEAM_PRESETS.length].name,
            bonus: 0,
          })),
          turn: 0,
          history: [],
          deck: [],
          hand: [],
          word: null,
          outcome: null,
          stolenBy: undefined,
          timer: { endsAt: null, remainingMs: s.settings.roundSeconds * 1000 },
          notice: null,
        })),

      revealHand: () =>
        set((s) => {
          if (s.hand.length === HAND_SIZE) return { phase: "choose" };
          return { phase: "choose", ...dealHand(s) };
        }),
      shuffleHand: () =>
        set((s) => {
          // Skipped cards go to the bottom of the deck: seen, but not played.
          const dealt = dealHand(s, s.hand);
          return { ...dealt, deck: [...dealt.deck, ...s.hand] };
        }),
      chooseWord: (card) =>
        set((s) => {
          const key = normalize(card.word);
          const isCustom = card.categoryId === CUSTOM_CATEGORY_ID;
          return {
            phase: s.settings.picker === "opponents" ? "pass" : "ready",
            word: card,
            played: isCustom
              ? s.played
              : [...s.played.filter((w) => w !== key), key],
            timer: {
              endsAt: null,
              remainingMs: s.settings.roundSeconds * 1000,
            },
          };
        }),
      writeWord: (text) => {
        const word = text.trim().replace(/\s+/g, " ");
        if (!word) return;
        get().chooseWord({
          word,
          categoryId: CUSTOM_CATEGORY_ID,
          difficulty: "custom",
        });
      },
      showWordToDrawer: () =>
        set((s) => (s.phase === "pass" ? { phase: "ready" } : s)),
      backToHand: () =>
        set((s) => ({
          phase: "choose",
          played: s.word
            ? s.played.filter((w) => w !== normalize(s.word!.word))
            : s.played,
          word: null,
        })),
      startClock: () =>
        set((s) => ({
          phase: "drawing",
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
      resumeClock: () =>
        set((s) =>
          s.timer.endsAt !== null
            ? s
            : {
                timer: {
                  endsAt: Date.now() + s.timer.remainingMs,
                  remainingMs: s.timer.remainingMs,
                },
              },
        ),
      endTurn: (outcome) =>
        set((s) => {
          if (s.phase !== "drawing") return s;
          const remainingMs = s.timer.endsAt
            ? Math.max(0, s.timer.endsAt - Date.now())
            : s.timer.remainingMs;
          return {
            phase: "result",
            outcome,
            stolenBy:
              outcome === "guessed" || stealCandidates(s).length === 0
                ? null
                : undefined,
            timer: { endsAt: null, remainingMs },
          };
        }),
      setOutcome: (outcome) =>
        set((s) => ({
          outcome,
          stolenBy:
            outcome === "guessed" || stealCandidates(s).length === 0
              ? null
              : undefined,
        })),
      setStolenBy: (teamId) => set({ stolenBy: teamId }),
      nextTurn: () =>
        set((s) => {
          if (s.phase !== "result" || !s.word || !s.outcome) return s;
          const team = currentTeam(s);
          const record: TurnRecord = {
            teamId: team.id,
            drawer: currentDrawer(s),
            pickedBy:
              s.settings.picker === "opponents" ? pickingTeam(s).id : null,
            custom: s.word.categoryId === CUSTOM_CATEGORY_ID,
            word: s.word.word,
            outcome: s.outcome,
            stolenBy: s.outcome === "guessed" ? null : (s.stolenBy ?? null),
          };
          const turn = s.turn + 1;
          const over = turn >= s.teams.length * s.settings.turnsPerTeam;
          return {
            history: [...s.history, record],
            turn,
            phase: over ? "gameover" : "handoff",
            hand: [],
            word: null,
            outcome: null,
            stolenBy: undefined,
            notice: null,
            timer: {
              endsAt: null,
              remainingMs: s.settings.roundSeconds * 1000,
            },
          };
        }),

      adjustScore: (teamId, delta) =>
        set((s) => ({
          teams: s.teams.map((t) =>
            t.id === teamId ? { ...t, bonus: t.bonus + delta } : t,
          ),
        })),
      endGame: () => {
        // A finished-but-unconfirmed turn still counts.
        if (get().phase === "result") get().nextTurn();
        set({
          phase: "gameover",
          hand: [],
          word: null,
          timer: { endsAt: null, remainingMs: 0 },
        });
      },
      rematch: () => get().startGame(),
      newSetup: () =>
        set((s) => ({
          phase: "setup",
          teams: s.teams.map((t) => ({ ...t, bonus: 0 })),
          history: [],
          turn: 0,
          hand: [],
          word: null,
          outcome: null,
        })),
      toggleMuted: () => set((s) => ({ muted: !s.muted })),
      dismissNotice: () => set({ notice: null }),
    }),
    {
      name: STORAGE_KEYS.pictionary,
      version: 2,
      migrate: (persisted, version) => {
        const state = persisted as Partial<PictionaryState>;
        // v2 added settings.picker.
        if (version < 2 && state.settings) {
          state.settings = { ...defaultSettings, ...state.settings };
        }
        return state as PictionaryState;
      },
      // Rehydrated manually after mount so server and client HTML match.
      skipHydration: true,
      partialize: (s) => ({
        phase: s.phase,
        teams: s.teams,
        settings: s.settings,
        theme: s.theme,
        turn: s.turn,
        deck: s.deck,
        hand: s.hand,
        word: s.word,
        timer: s.timer,
        outcome: s.outcome,
        stolenBy: s.stolenBy,
        history: s.history,
        played: s.played,
        muted: s.muted,
      }),
    },
  ),
);
