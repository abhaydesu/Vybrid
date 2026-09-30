# Vybrid progress

A one-stop shop for playing games with friends and family in person. Everything a game needs lives on the site. Mobile first.

_Last updated: 2026-09-30. Nothing is committed yet: all of the work below is still uncommitted in the working tree._

## How we work

- **One game at a time.** Finish and polish a game before starting the next.
- **Play-mode structure (required for every game):**
  - A details page shows only **What you need** and **How to play**, with a **Play now** button. The button reads **Resume game** when there's a saved game.
  - The game itself runs on its own `/play` page.
  - Details pages use `src/app/components/GameDetails.tsx`, play pages use `src/app/components/GamePlayShell.tsx`, and each game is registered in `src/app/games/playable.ts`.
- **Game state** is kept in a zustand store saved to the browser (`skipHydration` + `rehydrate()` after mount). Games survive a refresh and keep the phone screen awake while playing.

## Done

### UI foundation
- **Design system** in `src/app/globals.css`:
  - "Lego" bricks (`.brick`, `.brick-press`, `.studs`), 3D buttons (`.btn`) and keycap buttons (`.keycap`).
  - Colors come from tone classes (`.tone-red` and so on).
  - Warm dotted background, Bricolage Grotesque + DM Sans fonts.
- **Navigation dock** (`NavDock.tsx`): at the bottom on mobile, at the top on desktop.
- **Line-art characters** (`Character.tsx`), plus shared icons.
- **Pages:** home, a `/games` catalogue with filters, `/tools` (loose word deck + timer), and shared details/play layouts.
- `tailwind.config.ts` was removed because Tailwind v4 never read it. Tokens now live in `@theme`.

### Pictionary: done (`/games/offline/pictionary` → `/play`)
- **Setup:** 2–4 teams with optional player names so drawers rotate; drawing time; turns per team; difficulty; 9 word categories (about 580 hand-picked words, including "Desi life").
- **Custom theme deck (beta):** pulls related words from Datamuse via `src/app/api/words/theme/route.ts`.
- **Who picks the word** is a setting:
  - "The other team" (default): the opponents choose from 3 options or write their own word, then hand the phone to the drawer.
  - "The drawer": the drawer picks.
- **Played words:** only words actually chosen count as played. Browsing past a word doesn't.
- **Round flow:** a hold-to-peek button for the drawer, a timer with ticks and a buzzer, "They got it" / "Give up", then a result screen.
- **Steals:** the picking team can never steal, so steals only happen with 3+ teams.
- **Scores:** editable scoreboard, game-over screen with a list of every word, rematch.
- **Code:** `src/store/pictionaryStore.ts`, `src/app/components/pictionary/*`, `src/lib/words/*`.

### Top 9 (Family Feud style): nearly done (`/games/top-9` → `/play`)
- **Two ways to play:**
  - **Host mode:** the host sees the answers and taps tiles to reveal them. A **room view** hides the answers when the phone is shown around.
  - **Host-free mode:** teams type their guesses, and a forgiving matcher checks them against answers and alternatives, allowing typos and plurals (`src/lib/top9/match.ts`).
- **Round flow:** face-off → the team in control guesses with 3 strikes → the other team steals → the round ends and the pot is banked. Optional double points in the final round. Undo for reveals, strikes and steals. Editable scores.
- **Question bank: 8,532 boards across 16 categories.**
  - **8,463 real survey boards** from **ProtoQA** (CC BY 4.0, https://github.com/iesl/protoqa-data). `scripts/build-top9-data.mjs` downloads and cleans the data into `src/data/top9/survey.json` plus `survey-meta.json`:
    - fixes capitalisation and garbled characters,
    - removes duplicates,
    - drops boards with fewer than 4 answers and keeps the top 9 answers,
    - sorts questions into categories,
    - flags sexual content as "After dark (18+)", which is opt-in.
  - **69 Vybrid originals** (`src/lib/top9/originals.ts`), including 38 "Desi life" boards written by us.
  - **Boards vary in size** (4–9 answers), because most survey questions have 4–7 answers.
- **Serving questions:**
  - The survey file stays on the server; the API only deals questions for the chosen categories. `POST /api/games/top-9` takes `{ categories, exclude, perCategory }`; `GET` returns the categories with board counts.
  - Played boards are avoided on that phone. A category that runs out refills from played boards.
  - With no connection, the game falls back to the built-in originals and tells the host.
- **Categories:** chosen in setup (Clear / All categories, per-category toggles with counts, 18+ as a separate switch). The **host can switch category or skip a question before any round**, and the choice carries into later rounds.
- **Code:** `src/store/top9Store.ts` (v2, with an upgrade path from v1 saves), `src/app/components/top9/*`, `src/lib/top9/*`.

#### Verified (last run, all passing, no console errors)
- Deck API: bad input rejected; adult questions never appear in family decks; played boards excluded; exhausted categories refill.
- Browser test on phone size:
  - Old v1 saves upgrade cleanly.
  - Clear disables Start; picking categories works.
  - Host category switch and skip work, and the chosen category carries into the next round.
  - A 6-answer board can be cleared.
  - The offline fallback works.
  - Typed guesses match.
- The survey data is confirmed absent from browser bundles.
- `eslint`, `tsc` and `next build` all pass.

## Next steps (Top 9, before calling it done)
- [x] Reviewed the new setup and round-intro screens on mobile. Fixed the inflated board count (shared boards were counted twice) and the duplicate "Round X of Y" label.
- [ ] Spot-check more survey boards in play for odd wording or dated US-only questions. Consider a "US pop culture" flag or hiding the most dated ones.
- [x] Tested typed guesses against "/" answers: "oven" matches "Stove / oven", and "club" matches "Bar / club".
- [ ] Consider giving the Desi originals extra categories (e.g. a wedding question also in Love & dating), and writing more Desi boards.
- [ ] Decide on the **licensing risk** of the ProtoQA data (see Notes) before any public or commercial launch.
- [ ] Commit the work.

## Later
- [ ] **Pass the Bomb:** still loose tools (a word deck + a "fuse" timer). Needs a full play mode following the play-mode structure.
- [ ] **Remaining in-person games** need play modes: Mafia / Werewolf (role dealer, night-phase narrator), Charades (can reuse the Pictionary flow), Two Truths & a Lie, Hot Seat (score tracker), Categories (category spinner).
- [ ] **Tidy-up:** `src/store/gameStore.ts`, `src/lib/mongoose.ts` and `src/models/Top9Question.ts` are unused leftovers from the first setup. The Top 9 API no longer uses MongoDB.

## Notes
- **ProtoQA licence:** the dataset is published under CC BY 4.0, and the setup screen and rules page credit it. However, its survey questions were transcribed by fans from *Family Feud*, so the show's owners may hold rights that the dataset authors couldn't license. This is fine for personal use; get advice before a commercial launch. The pack is separate (`src/data/top9/`), so it can be removed or replaced without touching the game.
- **Rebuilding the survey data:** `node scripts/build-top9-data.mjs [local protoqa-data dir]`. With no path it downloads from GitHub. It uses macOS `/usr/share/dict/web2` for name capitalisation if available, and works without it.
- **Testing** used Playwright with the system Chrome (throwaway scripts, not in the repo). Next time, consider adding proper e2e tests.
