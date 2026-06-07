# Sakura Kills Everything — Project Constitution & Agent Entrypoint

> **If you are an AI agent or new developer: read this whole file first.** It is the map.
> You should not need to rediscover the project. When this file and the code disagree, fix
> whichever is wrong and update the other.

---

## What This Is

**Sakura Kills Everything** is a canon-first, mobile-first family comedy game based on a real
dog named Sakura and real backyard events.

It is **not** a generic pet game. It is **not** an arcade prototype with a dog skin. It is a
loving, ridiculous, slightly vicious family mythology: a beloved dog who sees the backyard as
a battlefield and herself as its destined apex predator. The humor comes from **total
commitment** — Sakura is adorable, sincere, and, in her own mind, a ruthless warlord.

Every design decision asks: *Does this feel like Sakura? Would the family recognize this as
true?*

The first audience is the family — specifically Tanisha, the original Witness.

---

## Current Status (Stage 0.4)

| Stage | Status | Scope |
|---|---|---|
| 0.1 — Foundation | ✅ Complete | Repo, home screen, real Sakura photo, theme/engine helpers, Duck Hunt shell, smoke tests |
| Canon 0.1 | ✅ Complete | ~21k-word worldbuilding bible (canon library under `docs/canon/`) |
| 0.2 — Game Platform | ✅ Complete | Incident platform, canon data layer, Duck Hunt first playable, Canon Archive portal |
| 0.3 — Incident Memory + Patrol | ✅ Complete | Persistent incident archive, Duck Hunt report filing, Canon saved view + stats, Patrol prototype |
| **0.4 — Patrol Polish + Archive Usability** | ✅ **This stage** | **Backyard zone map for Patrol sector select; archive filters + grouping + counts; incident detail modal; territory stats** |
| 0.5 — Sakura Animation | ⚪ Next | Sakura sprite/photo animation pipeline v0.1. Not started. |

**Playable now:** Duck Hunt (a real, short, replayable run that generates incidents).
**Prototype now:** Patrol (sector select → encounter-by-encounter surveillance sweep → report).
**Live now:** Sakura Canon (archive portal **plus a persistent Permanent Record** of filed reports + stats).
**Future:** RPG Hunt, Chaos Mode (themed placeholders only).

**Incidents now persist.** A finished run files into the permanent record via "File Official
Report"; the Canon Archive reads it back. Storage key: `ske-incidents-v1` (capped, newest first).

**The project is canon-driven, not mode-driven. Incidents are the atomic unit of gameplay.**

---

## Non-Negotiable Canon Laws

1. Sakura is **always lovable**. Never cruel, never the butt of the joke.
2. Sakura is **sincere, not ironic**. She does not know she is funny.
3. Sakura is allowed to be **vicious in a cartoon/mythic way**.
4. The humor comes from treating absurd backyard events as **historic military records**.
5. **Squirrels have zero confirmed catches.** Ever.
6. Squirrels may be pursued, cornered, humiliated, or narrowly escape — **never confirmed caught**.
7. **The Bird Incident** is the legendary confirmed aerial catch (witness: Tanisha).
8. **Birds may be catchable** in Duck Hunt — via feather-burst / official report / comic abstraction.
9. **Vorgs remain unconfirmed.** Encounters produce non-confirmation only. The mystery only grows.
10. The **official record vs. likely reality** structure is sacred. Every incident carries both.
11. **Canon beats mechanics.** If a mechanic contradicts canon, fix the mechanic.
12. **Failure is funny, not punishing.**
13. **Every mechanic should make Sakura more recognizable to the family.**

---

## Tone (Stage 0.2 Adjustment)

The game can be **more violent than a generic family-safe game** — do not over-sanitize the
premise. The register is cartoon-mythic, not grim.

**Allowed:** "Bird neutralized." · "Feather evidence recovered." · "Sakura has entered kill
mode." · "The backyard trembles." · "Tiny predator. Historic consequences." · "confirmed
kill" as mythic comedy.

**Never:** realistic gore · blood sprays · cruelty for its own sake · animal suffering ·
mean-spiritedness toward Sakura · grim realism.

**Preferred violence style:** cartoon impact, feather bursts, dust clouds, dramatic
silhouettes, medals, incident reports, absurd official language.

Full guidance: `docs/design/tone-and-voice.md` and `docs/design/narrative-voice-guide.md`.

---

## Canon Hierarchy (Source of Truth)

| Tier | Source | Status |
|---|---|---|
| 1 | Real Sakura incidents and behaviors | Absolute truth |
| 2 | Family-confirmed mythology (vorgs, the rabbits, etc.) | Canonical |
| 3 | Canon docs in `docs/canon/` | Binding once written |
| 4 | System designs in `docs/systems/` | Derivative of canon |
| 5 | Code | Implements canon — never defines it |

**When in doubt, canon wins.**

---

## Architecture (No Build Step)

Vanilla HTML/CSS/JS. **No framework. No bundler. No build step. No backend.** Files load as
classic `<script>` tags and attach to `window` globals so everything works on `file://` and
in Playwright without a dev server.

### Global namespaces
- `window.SakuraData` — data layer: `.zones`, `.creatures`, `.incidents`, `.voiceLines`
  (+ `zoneById`, `creatureById`, `incidentById`, `line()`).
- `window.SakuraRandom` — seedable RNG helpers.
- `window.SakuraVoice` — voice-line selection + incident narration.
- `window.SakuraIncident` — the incident engine: `resolveOutcome`, `createIncident`,
  `summarizeRun` (enforces canon).
- `window.SakuraUI` — `renderIncidentCard`, `renderInto` (full cards); `renderIncidentRow`,
  `renderRowsInto` (compact browsable rows); `openIncidentDetail`/`closeIncidentDetail` (detail modal).
- `window.SakuraStorage` — persistent record: `saveIncidents(incidents, ctx)`, `loadIncidents()`,
  `clearIncidents()`, `getStats()` (now incl. `byZone`/`byZoneId`/`byCreature`/`mostCommonCreature`),
  `countByZoneId()`. Key `ske-incidents-v1`, capped at 200, newest first.
- `window.SakuraEngine` — canvas/loop helpers (kept for future modes).

### Where things live
```
index.html                     Home screen (links theme.css)
src/ui/theme.css               Design tokens (single source of truth)
src/ui/components.css          Shared components: incident cards, buttons, toasts
src/ui/incident-card.js        Incident card renderer (window.SakuraUI)
src/data/{zones,creatures,incidents,voice-lines}.js   Canon data layer
src/engine/{random,voice-engine,incident-engine}.js   Engines
src/engine/index.js            Canvas helpers (window.SakuraEngine)
src/utils/storage.js           Persistent incident memory (window.SakuraStorage)
src/modes/duck-hunt/           Duck Hunt — first playable (files reports)
src/modes/side-scroller/       Patrol — prototype (user-facing name: "Patrol")
src/modes/canon/               Sakura Canon — archive portal + Permanent Record
src/modes/{rpg,chaos}/         Future modes (themed placeholders)
docs/canon/                    The worldbuilding bible (Tier 1-3)
docs/systems/                  Gameplay/incident system designs (Tier 4)
docs/design/                   Pillars, modes, tone, achievements, voice guide
docs/technical/                Architecture, testing, performance
tests/playwright/              Playwright specs
```

Load order on a gameplay page: **data → engine → ui → mode**.

---

## How to Run & Test

```bash
npm install
npx playwright install     # first time only — downloads the browser
npm test                   # runs the Playwright suite (headless)
```
Or just open `index.html` in a browser — no server needed. See `README.md` for operator
notes and `docs/technical/testing-plan.md` for coverage. Test screenshots/results land in
`tests/screenshots/` and `tests/playwright/results.json` (git-ignored).

---

## Development Rules

- Vanilla only. No frameworks/bundlers/TypeScript. No new runtime dependencies.
- Each mode lives in its own directory. Do not collapse modes into one file.
- **No fake Sakura images.** Use the real photo at `src/assets/sakura/`; CSS placeholders
  otherwise.
- Reuse the platform: new gameplay should produce incidents via `SakuraIncident` and speak
  via `SakuraVoice`. Don't reinvent these.
- Don't overbuild. Implement what the current stage needs; leave seams for the next.
- Keep it mobile-first and fast (see `docs/technical/performance-budget.md`).

---

## How Future Agents Avoid Drift

1. Read this file, then `docs/systems/core-gameplay-loop.md` and `incident-system.md`.
2. Treat the **Canon Laws** above as hard constraints — especially #5/#6 (squirrels),
   #9 (vorg), and #10 (dual layer).
3. Build new modes on the existing engines, not beside them.
4. When you finish a stage, update: this file's status table, `README.md`, the relevant docs,
   and the tests. Docs must match code.
5. Do not resolve the vorg. Do not let a squirrel be caught. Do not make Sakura the joke.

---

## Quick Reference

- Agent entrypoint: `CLAUDE.md` (this file) · Operator notes: `README.md`
- Canon index: `docs/canon/sakura-canon-bible.md`
- Core systems: `docs/systems/core-gameplay-loop.md`, `docs/systems/incident-system.md`
- Tone: `docs/design/tone-and-voice.md`, `docs/design/narrative-voice-guide.md`
- First playable: `src/modes/duck-hunt/`
- Tests: `tests/playwright/`
