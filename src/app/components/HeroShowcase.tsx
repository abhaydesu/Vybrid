import Mascot from "./Mascot";
import PhoneDemo from "./PhoneDemo";

/**
 * The hero picture: a playable phone with the gang crowding round it. The
 * uncle and didi peek from behind; the samosa and chai sit in front.
 */
export default function HeroShowcase() {
  return (
    <div className="relative mx-auto w-full max-w-[26rem] pb-6 lg:max-w-[30rem]">
      {/* A nudge to try it */}
      <p
        aria-hidden="true"
        className="absolute -top-1 left-0 z-20 flex rotate-[-6deg] items-center gap-1 text-xl text-[#8a8780] sm:left-2"
        style={{ fontFamily: "var(--font-kalam), cursive", fontWeight: 700 }}
      >
        try me!
        <svg viewBox="0 0 40 24" className="h-5 w-9" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round">
          <path d="M2 6c10-4 22-2 32 10" />
          <path d="M27 17l7-1-1-7" />
        </svg>
      </p>

      <Mascot
        kind="uncle"
        mood="cheer"
        color="#2f7bff"
        className="absolute bottom-20 -left-2 z-0 h-24 w-24 -rotate-6 sm:h-28 sm:w-28 lg:bottom-24 lg:h-36 lg:w-36"
        delay={0.3}
      />
      <Mascot
        kind="didi"
        mood="happy"
        color="#ff4f9a"
        className="absolute bottom-24 -right-2 z-0 h-24 w-24 rotate-6 sm:h-28 sm:w-28 lg:bottom-28 lg:h-36 lg:w-36"
        delay={1.4}
      />

      <div className="relative z-10 mx-auto w-[15.5rem] pt-8 sm:w-[16.5rem]">
        <PhoneDemo />
      </div>

      <Mascot
        kind="samosa"
        mood="cheer"
        className="pointer-events-none absolute bottom-0 left-0 z-20 h-16 w-16 sm:h-20 sm:w-20 lg:h-28 lg:w-28"
        delay={0.9}
      />
      <Mascot
        kind="chai"
        mood="wink"
        className="pointer-events-none absolute bottom-0 right-1 z-20 h-14 w-14 sm:h-16 sm:w-16 lg:h-24 lg:w-24"
        delay={2}
      />
    </div>
  );
}
