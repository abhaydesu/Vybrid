export default function TopNinePage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col gap-10 px-5 pb-16 pt-10 sm:px-8 lg:px-10">
      <header className="rounded-3xl border border-blue-100 bg-white/90 p-6 shadow-neon">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-blue-700">
          Game Mode
        </p>
        <h1 className="mt-3 text-hero font-semibold text-ink">Top 9</h1>
        <p className="mt-3 text-base text-ink/70">
          Family Feud-style rounds. Hook up data, buzzer sounds, and team
          reveals next.
        </p>
      </header>

      <section className="grid gap-4 sm:grid-cols-2">
        {[...Array(6)].map((_, index) => (
          <div
            key={`slot-${index}`}
            className="flex items-center justify-between rounded-2xl border border-blue-100 bg-white px-4 py-4 shadow-neon"
          >
            <span className="text-sm font-semibold text-ink/60">
              Answer Slot
            </span>
            <span className="text-lg font-semibold text-ink">#{index + 1}</span>
          </div>
        ))}
      </section>
    </main>
  );
}
