import type { CharacterKind, Tone } from "@/lib/games";
import Mascot, { type MascotKind, type MascotMood } from "./Mascot";

interface CharacterProps {
  kind: CharacterKind;
  tone: Tone;
  className?: string;
  /** Kept for older call sites; mascots have no backdrop. */
  bare?: boolean;
}

/** Each game's mascot, picked to suit how it plays. */
const LOOK: Record<CharacterKind, { kind: MascotKind; mood: MascotMood; fuse?: boolean }> = {
  // Top 9: the uncle who hosts every family quiz
  host: { kind: "uncle", mood: "cheer" },
  // Pass the Bomb: a laddoo with a lit fuse
  bomber: { kind: "laddoo", mood: "shocked", fuse: true },
  // Mafia: the didi who knows everyone's secrets
  detective: { kind: "didi", mood: "shifty" },
  // Charades: an over-acting samosa
  actor: { kind: "samosa", mood: "cheer" },
  // Pictionary: a dice, ready to roll
  artist: { kind: "dice", mood: "happy" },
  // Imposter: a cutting chai with a secret
  fibber: { kind: "chai", mood: "wink" },
  // Two Truths & a Lie: a jalebi, all twists
  teller: { kind: "jalebi", mood: "shifty" },
  // Hot Seat: a golgappa feeling the spice
  hotseat: { kind: "golgappa", mood: "sweaty" },
  // Categories: a kulfi, keeping cool under the timer
  writer: { kind: "kulfi", mood: "happy" },
};

export default function Character({ kind, tone, className }: CharacterProps) {
  const look = LOOK[kind];
  return (
    <span className={`tone-${tone} inline-grid place-items-center ${className ?? ""}`}>
      <Mascot kind={look.kind} mood={look.mood} fuse={look.fuse} className="h-full w-full" />
    </span>
  );
}
