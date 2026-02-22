import { create } from "zustand";

export type GameId = "top-9" | "pass-the-bomb" | null;

export interface TeamScore {
  id: string;
  name: string;
  points: number;
}

export interface GameState {
  activeGame: GameId;
  hostName: string;
  isTimerRunning: boolean;
  timerSeconds: number;
  teams: TeamScore[];
  setActiveGame: (game: GameId) => void;
  setHostName: (name: string) => void;
  setTimerRunning: (running: boolean) => void;
  setTimerSeconds: (seconds: number) => void;
  updateScore: (teamId: string, delta: number) => void;
  resetScores: () => void;
}

const initialTeams: TeamScore[] = [
  { id: "alpha", name: "Team Alpha", points: 0 },
  { id: "beta", name: "Team Beta", points: 0 },
];

export const useGameStore = create<GameState>((set) => ({
  activeGame: null,
  hostName: "Host",
  isTimerRunning: false,
  timerSeconds: 45,
  teams: initialTeams,
  setActiveGame: (game) => set({ activeGame: game }),
  setHostName: (name) => set({ hostName: name }),
  setTimerRunning: (running) => set({ isTimerRunning: running }),
  setTimerSeconds: (seconds) => set({ timerSeconds: seconds }),
  updateScore: (teamId, delta) =>
    set((state) => ({
      teams: state.teams.map((team) =>
        team.id === teamId
          ? { ...team, points: Math.max(0, team.points + delta) }
          : team,
      ),
    })),
  resetScores: () => set({ teams: initialTeams }),
}));
