export default function PassTheBombPage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col gap-10 px-5 pb-16 pt-10 sm:px-8 lg:px-10">
      <header className="rounded-3xl border border-blue-100 bg-white/90 p-6 shadow-neon">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-blue-700">
          Game Mode
        </p>
        <h1 className="mt-3 text-hero font-semibold text-ink">Pass the Bomb</h1>
        <p className="mt-3 text-base text-ink/70">
          Timer-based word guessing with escalating tension and sound cues.
        </p>
      </header>

      <section className="grid gap-6 sm:grid-cols-2">
        <div className="rounded-3xl border border-blue-100 bg-white p-6 shadow-neon">
          <p className="text-sm uppercase tracking-[0.3em] text-ink/50">
            Round Timer
          </p>
          <div className="mt-4 text-mega font-semibold text-blue-700">
            00:45
          </div>
          <p className="mt-2 text-sm text-ink/60">
            Tap to start the countdown.
          </p>
        </div>
        <div className="rounded-3xl border border-blue-100 bg-white p-6 shadow-neon">
          <p className="text-sm uppercase tracking-[0.3em] text-ink/50">
            Current Prompt
          </p>
          <div className="mt-4 text-hero font-semibold text-ink">
            Something you grill
          </div>
          <p className="mt-2 text-sm text-ink/60">Swap for the next word.</p>
        </div>
      </section>
    </main>
  );
}
