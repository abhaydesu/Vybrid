import type { Metadata } from "next";

import RandomWordGenerator from "../components/RandomWordGenerator";
import Timer from "../components/Timer";

export const metadata: Metadata = {
  title: "Tools | Vybrid",
};

export default function ToolsPage() {
  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 pt-6 sm:px-6 md:pt-10">
      <header>
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-ink/45">
          The toolbox
        </p>
        <h1 className="mt-1.5 font-display text-[clamp(2.4rem,9vw,4rem)] font-extrabold leading-none tracking-[-0.03em]">
          Bring your <span className="scribble-underline">own game.</span>
        </h1>
        <p className="mt-4 max-w-lg leading-relaxed text-ink-soft">
          Playing something that isn&apos;t in the catalogue? Grab a timer or a
          word deck and make up the rules as you go.
        </p>
      </header>
      <div className="grid gap-10 md:grid-cols-2 md:items-start">
        <RandomWordGenerator tone="yellow" />
        <Timer tone="green" />
      </div>
    </main>
  );
}
