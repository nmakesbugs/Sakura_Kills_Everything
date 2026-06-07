# Sakura Kills Everything

> A loving, ridiculous, slightly vicious family mythology game about a real dog named Sakura,
> who has decided the backyard is a battlefield and she is its apex predator.
>
> Tiny predator. Historic consequences.

![Stage](https://img.shields.io/badge/stage-0.6.0-4a7c4e) ![Flagship](https://img.shields.io/badge/The_Bird_Incident-playable-4a7c4e) ![Mode](https://img.shields.io/badge/adventure--first-pivot-c97c3a) ![Tests](https://img.shields.io/badge/tests-Playwright-blue)

> **Stage 0.6.0 — adventure-first pivot.** The systems were strong but the game was *boring*:
> mode-first arcade (tap target → incident → repeat) had no story. 0.6.0 reframes the product
> around **authored Sakura adventures**. The flagship, **The Bird Incident**, is a 3–6 minute
> choice-driven episode: briefing → observation → approach → complication → a timed strike →
> aftermath → an official report you'll want to show someone. Duck Hunt is demoted to a "Practice
> Yard" bonus. The goal isn't score — it's *the funniest official record of Sakura's version of
> events.* See `docs/design/adventure-first-refactor.md` and
> `docs/qa/stage-adventure-refactor-playtest-notes.md`.

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
| **The Bird Incident** | ✅ Playable **flagship** — authored choice-driven episode → official report → file |
| Squirrel Surveillance / Garden Frontier / Vorg Watch | ⚪ Coming soon — teased on the home screen |
| **Practice Yard** (was Duck Hunt) | ✅ Bonus — clean arcade target range; symbolic Sakura, readable report |
| **Free Patrol** | 🟦 Prototype — pick a sector from the **backyard zone map**, sweep it, file the report |
| **Permanent Record** (Sakura Canon) | ✅ Live — portal + filed reports with filters (incl. Adventures), grouping, detail view, territory stats |
| **Persistent incidents** | ✅ Runs/adventures save to `localStorage` (`ske-incidents-v1`) and survive across sessions |
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
  full suite passing at Stage 0.4 (see final count from `npm test`).
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
src/ui/        sakura-presence.{css,js}                   → window.SakuraPresence (portraits, token, FX)
src/utils/     storage.js (ske-incidents-v1)              → window.SakuraStorage
src/data/      adventures.js (episode registry)           → window.SakuraData.adventures
src/adventures/<id>/  authored episodes (flagship: bird-incident)
src/modes/     duck-hunt=Practice Yard, side-scroller=Free Patrol, canon=Permanent Record, rpg/chaos (future)
docs/          canon (the bible) · systems · design · technical · qa
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
- **Stage 0.4 — Patrol Polish + Zone Map + Archive Usability:** ✅ done — backyard zone map for
  sector selection, archive filters + grouping + counts, incident detail view, territory stats.
- **Stage 0.4.1 — Runtime Experience Rescue:** ✅ done — rebuilt Duck Hunt, removed the cursed
  in-game Sakura photo, summary-first readable report.
- **Stage 0.5.0 — Runtime Feel + Sakura Visual Pipeline v0.1:** ✅ done — `SakuraPresence`.
- **Stage 0.6.0 — Adventure-first pivot + The Bird Incident:** ✅ done — flagship authored
  episode; Duck Hunt → Practice Yard; home reframed around adventures.
- **Next — Episode 2 (Squirrel Surveillance)** on the same pattern, *after a phone playtest of
  The Bird Incident's strike beat*; then real Sakura sprite art per
  `docs/assets/sakura-sprite-pipeline-v0.1.md`.

---

*The backyard is not safe. Sakura has entered the hunting grounds.*
