import type { CharacterKind, Tone } from "@/lib/games";

interface CharacterProps {
  kind: CharacterKind;
  tone: Tone;
  className?: string;
  /** Hide the colored blob behind the figure. */
  bare?: boolean;
}

const INK = "var(--color-ink)";

const stroke = {
  stroke: INK,
  strokeWidth: 3,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  fill: "none",
};

function sparkle(x: number, y: number, r = 6) {
  const k = r * 0.3;
  return `M${x} ${y - r}L${x + k} ${y - k}L${x + r} ${y}L${x + k} ${y + k}L${x} ${y + r}L${x - k} ${y + k}L${x - r} ${y}L${x - k} ${y - k}Z`;
}

const ARM_DOWN_LEFT = "M42 98C36 108 34 116 36 126";
const ARM_DOWN_RIGHT = "M78 98C84 108 86 116 84 126";
const EYES = (
  <>
    <circle cx="53" cy="55" r="2.3" fill={INK} />
    <circle cx="67" cy="55" r="2.3" fill={INK} />
  </>
);
const SMILE = <path d="M54 63Q60 68 66 63" {...stroke} />;

function Pose({ kind }: { kind: CharacterKind }) {
  switch (kind) {
    case "detective":
      return (
        <>
          <path d="M50 55h6M64 55h6" {...stroke} />
          <path d="M55 64h10" {...stroke} />
          <path
            d="M44 42C44 29 50 24 60 24S76 29 76 42Z"
            {...stroke}
            style={{ fill: "var(--tone-solid)" }}
          />
          <path d="M45 37h30" stroke={INK} strokeWidth={2} />
          <path d="M35 42h50" {...stroke} strokeWidth={3.5} />
          <path d={ARM_DOWN_LEFT} {...stroke} />
          <path d="M78 98C88 92 92 84 92 78" {...stroke} />
          <path d="M92 78l4-7" {...stroke} strokeWidth={4.5} />
          <circle
            cx="101"
            cy="62"
            r="10"
            fill="white"
            fillOpacity={0.65}
            stroke={INK}
            strokeWidth={3}
          />
          <path d="M96 58q2-4 6-4" stroke={INK} strokeWidth={1.8} fill="none" strokeLinecap="round" />
        </>
      );
    case "actor":
      return (
        <>
          {EYES}
          <ellipse cx="60" cy="64.5" rx="3.6" ry="4.6" fill={INK} />
          <path d="M42 98C32 90 26 80 24 70" {...stroke} />
          <path d="M78 98C88 90 94 80 96 70" {...stroke} />
          <path d={sparkle(16, 58)} fill="var(--tone-solid)" stroke={INK} strokeWidth={2} strokeLinejoin="round" />
          <path d={sparkle(104, 56, 7)} fill="#ffc61a" stroke={INK} strokeWidth={2} strokeLinejoin="round" />
          <path d={sparkle(92, 30, 4)} fill="white" stroke={INK} strokeWidth={1.8} strokeLinejoin="round" />
        </>
      );
    case "artist":
      return (
        <>
          {EYES}
          {SMILE}
          <path
            d="M39 44C41 30 72 27 81 40C74 45 52 46 39 44Z"
            {...stroke}
            style={{ fill: "var(--tone-solid)" }}
          />
          <path d="M60 32l2-5" {...stroke} />
          <path d={ARM_DOWN_LEFT} {...stroke} />
          <path d="M78 98C88 94 92 90 92 86" {...stroke} />
          <path d="M88 88L102 62L108 66L94 91Z" fill="#ffc61a" stroke={INK} strokeWidth={2.5} strokeLinejoin="round" />
          <path d="M88 88L94 91L87 95Z" fill={INK} stroke={INK} strokeWidth={2} strokeLinejoin="round" />
          <path d="M102 62l6 4 2-3-6-4z" fill="#ffb3d4" stroke={INK} strokeWidth={2} strokeLinejoin="round" />
        </>
      );
    case "fibber":
      return (
        <>
          <path d="M50 56q3-3 6 0" {...stroke} />
          <circle cx="67" cy="55" r="2.3" fill={INK} />
          <path d="M54 64Q62 68 67 61" {...stroke} />
          <path d={ARM_DOWN_LEFT} {...stroke} />
          <path d="M78 98C84 106 86 114 82 120" {...stroke} />
          <path d="M79 118l6 6M85 118l-6 6" stroke={INK} strokeWidth={2.2} strokeLinecap="round" />
          <rect x="80" y="8" width="34" height="25" rx="9" fill="white" stroke={INK} strokeWidth={2.5} />
          <path d="M87 33l-4 8 11-8" fill="white" stroke={INK} strokeWidth={2.5} strokeLinejoin="round" />
          <text
            x="97"
            y="26"
            textAnchor="middle"
            fontFamily="var(--font-display)"
            fontWeight={800}
            fontSize="15"
            fill="var(--tone-edge)"
          >
            ?!
          </text>
        </>
      );
    case "hotseat":
      return (
        <>
          {EYES}
          <path d="M48 48l6 2M72 48l-6 2" {...stroke} strokeWidth={2.5} />
          <path d="M53 66q3.5-4 7 0t7 0" {...stroke} />
          <path
            d="M84 38C84 38 78 46 78 50A6 6 0 0 0 90 50C90 46 84 38 84 38Z"
            fill="#a5d5ff"
            stroke={INK}
            strokeWidth={2.2}
          />
          <path d={ARM_DOWN_LEFT} {...stroke} />
          <path d={ARM_DOWN_RIGHT} {...stroke} />
          <text x="20" y="46" fontFamily="var(--font-display)" fontWeight={800} fontSize="20" fill="var(--tone-solid)" stroke={INK} strokeWidth={1} transform="rotate(-14 20 46)">?</text>
          <text x="96" y="30" fontFamily="var(--font-display)" fontWeight={800} fontSize="16" fill="var(--tone-solid)" stroke={INK} strokeWidth={1} transform="rotate(12 96 30)">?</text>
        </>
      );
    case "writer":
      return (
        <>
          <path d="M50 56q3 3 6 0M64 56q3 3 6 0" {...stroke} />
          {SMILE}
          <path d="M74 45l13-11" stroke={INK} strokeWidth={7} strokeLinecap="round" />
          <path d="M74 45l13-11" stroke="#ffc61a" strokeWidth={3.5} strokeLinecap="round" />
          <path d="M42 98C38 108 42 114 48 114" {...stroke} />
          <path d="M78 98C82 108 78 114 72 114" {...stroke} />
          <rect x="45" y="100" width="30" height="31" rx="4" fill="white" stroke={INK} strokeWidth={3} />
          <path d="M51 110h18M51 116h18M51 122h11" stroke="var(--tone-dark)" strokeWidth={2.2} strokeLinecap="round" />
        </>
      );
    case "bomber":
      return (
        <>
          <circle cx="53" cy="55" r="4.2" fill="white" stroke={INK} strokeWidth={2} />
          <circle cx="67" cy="55" r="4.2" fill="white" stroke={INK} strokeWidth={2} />
          <circle cx="54" cy="55.5" r="1.8" fill={INK} />
          <circle cx="68" cy="55.5" r="1.8" fill={INK} />
          <ellipse cx="60" cy="66" rx="3.4" ry="4.2" fill={INK} />
          <path d="M42 98C34 92 30 86 28 78" {...stroke} />
          <path d="M22 74l-5-3M22 82h-6" {...stroke} strokeWidth={2.2} />
          <path d="M78 98C88 92 92 88 94 84" {...stroke} />
          <circle cx="100" cy="73" r="12" fill={INK} />
          <path d="M93 69q2-4 6-5" stroke="white" strokeWidth={2.5} fill="none" strokeLinecap="round" />
          <path d="M105 62C106 55 110 52 112 48" {...stroke} strokeWidth={2.5} />
          <path d={sparkle(113, 45, 6)} fill="#ffc61a" stroke={INK} strokeWidth={1.8} strokeLinejoin="round" />
        </>
      );
    case "host":
      return (
        <>
          {EYES}
          <path d="M53 62Q60 72 67 62Z" fill={INK} stroke={INK} strokeWidth={2} strokeLinejoin="round" />
          <path
            d="M51 78L60 82.5L51 87ZM69 78L60 82.5L69 87Z"
            stroke={INK}
            strokeWidth={2}
            strokeLinejoin="round"
            style={{ fill: "var(--tone-solid)" }}
          />
          <path d="M42 98C34 90 30 82 30 74" {...stroke} />
          <path d="M22 68l-5-3M21 76h-6" {...stroke} strokeWidth={2.2} />
          <path d="M78 98C86 94 88 90 88 84" {...stroke} />
          <path d="M88 86l-2-14" stroke={INK} strokeWidth={5} strokeLinecap="round" />
          <circle cx="85.5" cy="67" r="6.5" stroke={INK} strokeWidth={2.5} style={{ fill: "var(--tone-solid)" }} />
        </>
      );
  }
}

export default function Character({
  kind,
  tone,
  className,
  bare = false,
}: CharacterProps) {
  return (
    <svg
      viewBox="0 0 120 140"
      className={`tone-${tone} ${className ?? ""}`}
      aria-hidden="true"
      overflow="visible"
    >
      {!bare && (
        <path
          d="M62 14C92 12 112 36 110 66S88 128 58 126 8 100 10 70 32 16 62 14Z"
          style={{ fill: "var(--tone)" }}
        />
      )}
      <path
        d="M32 140C32 104 42 88 60 88S88 104 88 140"
        fill="white"
        stroke={INK}
        strokeWidth={3}
        strokeLinejoin="round"
      />
      <path d="M60 76v12" {...stroke} />
      <circle cx="60" cy="57" r="19" fill="white" stroke={INK} strokeWidth={3} />
      <circle cx="47.5" cy="62" r="3.6" style={{ fill: "var(--tone-solid)" }} opacity={0.35} />
      <circle cx="72.5" cy="62" r="3.6" style={{ fill: "var(--tone-solid)" }} opacity={0.35} />
      <Pose kind={kind} />
    </svg>
  );
}
