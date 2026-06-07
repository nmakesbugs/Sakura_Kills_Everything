# Sakura Kills Everything

> A loving, ridiculous, slightly vicious family mythology game about a real dog named Sakura,
> who has decided the backyard is a battlefield and she is its apex predator.
>
> Tiny predator. Historic consequences.

![Stage](https://img.shields.io/badge/stage-0.3.1-4a7c4e) ![Duck Hunt](https://img.shields.io/badge/Duck_Hunt-playable-4a7c4e) ![Patrol](https://img.shields.io/badge/Patrol-prototype-c97c3a) ![Tests](https://img.shields.io/badge/tests-45_passing-4a7c4e)

---

## What this is

Sakura Kills Everything is a **canon-first, mobile-first** comedy game. It is not a generic
pet game — it is the collected, dramatically exaggerated history of one dog's war on the
backyard. The joke is total commitment: the narrator treats every squirrel sighting as
military intelligence and every escaped robin as a strategic setback, and means it completely.

The core unit of the game is the **incident** — a record with two layers:

> **Official interpretation:** Sakura conducted a devastating airspace denial campaign.
> **Likely reality:** She scared two birds, missed a rabbit, and barked at a leaf.

---

## Current build status

| Area | Status |
|---|---|
| **Duck Hunt** | ✅ Playable — short replayable runs; file the report to the permanent record |
| **Patrol** | 🟦 Prototype — pick a sector, sweep it encounter-by-encounter, file the report |
| **Persistent incidents** | ✅ Runs save to `localStorage` (`ske-incidents-v1`) and survive across sessions |
| **Sakura Canon** | ✅ Live — archive portal **plus a Permanent Record** of filed reports + stats |
| **Home screen** | ✅ Mobile-first, real Sakura photo, modes labeled |
| RPG Hunt / Chaos Mode | ⚪ Future — themed placeholder pages only |
| Canon (worldbuilding) | ✅ ~21k words across `docs/canon/` |

---

## Run it

No build step. No server required.

```bash
git clone https://github.com/nmakesbugs/Sakura_Kills_Everything.git
cd Sakura_Kills_Everything
# Just open index.html in any modern browser, OR serve it statically.
```

Open `index.html` → tap **Duck Hunt** → **Begin Operation**. Tap targets to launch Sakura.
Birds may be neutralized (feathers). Squirrels always escape (canon). The far corner can
never be confirmed. At the after-action report, tap **File Official Report** to enter the run
into the permanent record — then open **Sakura Canon** to see it preserved with stats.

Or tap **Patrol** → choose a sector → resolve each encounter (Investigate / Stalk / Pounce /
Report) → file the patrol report. Patrol is surveillance; Duck Hunt is reaction. Both feed the
same incident archive.

---

## Test it

```bash
npm install
npx playwright install     # first time only — downloads Chromium
npm test                   # headless run
npm run test:headed        # watch it in a real browser window
npm run test:report        # open the last HTML report
```

- Specs: `tests/playwright/` (`home`, `duck-hunt`, `canon`, `patrol`, `storage`, `data-layer`) —
  **45 tests** at Stage 0.3.1.
- Results JSON: `tests/playwright/results.json` (git-ignored).
- Screenshots: `tests/screenshots/` (git-ignored). Nick keeps these as learning artifacts —
  they are produced by the QA helper scripts and on failures.

> **Clean-clone note:** `node_modules` is **not** committed — never trust it from a zip. Run
> `npm install`, then `npx playwright install` once to fetch the Chromium browser (separate
> from the npm package). Test results and screenshots stay git-ignored unless intentionally
> promoted. No server, bundler, or backend is required — tests run against `file://`.

---

## How it's built (for developers & agents)

Vanilla HTML/CSS/JS, classic `<script>` tags, `window` globals — works on `file://` with no
tooling. Load order on a gameplay page: **data → engine → ui → mode**.

```
src/data/      zones, creatures, incidents, voice-lines   → window.SakuraData
src/engine/    random, voice-engine, incident-engine      → window.SakuraIncident / SakuraVoice / SakuraRandom
src/ui/        theme.css, components.css, incident-card.js → window.SakuraUI
src/utils/     storage.js (ske-incidents-v1)              → window.SakuraStorage
src/modes/     duck-hunt (playable), side-scroller=Patrol (prototype), canon (live), rpg/chaos (future)
docs/          canon (the bible) · systems · design · technical
```

**Start here:** [`CLAUDE.md`](CLAUDE.md) is the full project constitution and agent
entrypoint. Then read [`docs/systems/core-gameplay-loop.md`](docs/systems/core-gameplay-loop.md)
and [`docs/systems/incident-system.md`](docs/systems/incident-system.md).

---

## Canon laws (the short version)

1. Sakura is always lovable and sincere — never the butt of the joke.
2. **Squirrels are never caught.** Zero confirmed catches, forever.
3. Birds may be neutralized — via feathers and official reports, never gore.
4. **The vorg is never confirmed.** The mystery only grows.
5. Every incident carries both the official record and the likely reality.
6. Cartoon-mythic violence is fine. Real gore, cruelty, and suffering are not.
7. Canon beats mechanics. Failure is funny, not punishing.

Full canon: [`docs/canon/sakura-canon-bible.md`](docs/canon/sakura-canon-bible.md).

---

## Roadmap

- **Stage 0.3 — Incident Memory + Patrol:** ✅ done — persistent incident history, Duck Hunt
  report filing, Canon Permanent Record + stats, and a first Patrol prototype.
- **Stage 0.4 — Patrol Polish + Zone Map + Archive Usability:** deepen Patrol, add a backyard
  zone map for sector selection, and make the Permanent Record more usable (filters / detail).
  Not started.

---

*The backyard is not safe. Sakura has entered the hunting grounds.*
