# Sakura Kills Everything — Project Constitution

## What This Is

**Sakura Kills Everything** is a family mythology game based on a real dog named Sakura and real backyard events.

This is not a generic pet game. It is not an arcade prototype with a dog skin.

It is a canon-first family comedy hunting game built around actual Sakura stories, named creatures, confirmed behaviors, and a mythology that has been building for years in a real backyard.

Every design decision should ask: *Does this feel like Sakura? Would the family recognize this as true?*

---

## Canon Hierarchy

All content in this project follows a strict source-of-truth hierarchy:

| Tier | Source | Status |
|---|---|---|
| 1 | Real Sakura incidents and behaviors | Absolute truth |
| 2 | Family-confirmed creature mythology (vorgs, the rabbits, etc.) | Canonical |
| 3 | Design documents in `/docs/canon/` | Binding once written |
| 4 | Game systems in `/docs/systems/` | Derivative of canon |
| 5 | Code | Implements canon — never defines it |

**When in doubt, canon wins.** If a game mechanic contradicts how Sakura actually behaves, fix the mechanic.

---

## Sakura Rules

- Sakura is real. Do not invent behaviors she does not have.
- Sakura always wins eventually. This is not optional.
- Sakura's hunting is earnest. She does not know she is funny.
- Sakura is not violent in a way that is not family-appropriate.
- Sakura has a confirmed prey hierarchy. See `/docs/canon/creature-taxonomy.md`.

---

## Tone Rules

- Earnest but absurd.
- Never edgy, never dark, never mean.
- Family-safe: a 7-year-old and a grandparent should both enjoy this.
- The copy should read like a military briefing written by someone who takes squirrels very seriously.
- No lorem ipsum. No placeholder text without personality. Every line should feel like the final game.

---

## Repository Structure

```
/docs
  /canon        — Sakura stories, backyard map, creature taxonomy, family cast, vorg mythology
  /design       — Game design bible, mode overview, tone and voice
  /systems      — Hunting, progression, creature AI, event engine
  /assets       — Asset pipeline, photo requirements, sprite rigging
  /technical    — Architecture, testing plan, performance budget

/src
  /app          — App shell and routing
  /engine       — Core game engine (future)
  /modes        — One folder per game mode
  /data         — Creature data, map data, event tables
  /assets       — Game assets (images, audio)
  /ui           — Shared UI components
  /utils        — Shared utilities

/tests
  /playwright   — Smoke tests and QA suites
```

---

## Development Rules

- Vanilla HTML/CSS/JS. No frameworks, no bundler, no build step unless explicitly decided.
- `index.html` is the entry point. Open it directly in a browser.
- Tests run via Playwright: `npx playwright test`
- No fake Sakura images. Use real photos when available; use CSS placeholders until then.
- Do not collapse game modes into one file. Each mode lives in its own directory.
- Do not overbuild. Only implement what the current build stage requires.

---

## Build Log

| Build | Status | Scope |
|---|---|---|
| 1 | Complete | Foundation: repo structure, home screen, docs scaffold, Playwright smoke tests |
| 2 | Planned | Duck Hunt mode shell, canon population, CSS theme tokens |

---

## Project Files Quick Reference

- Home screen: `index.html`
- Canon: `docs/canon/sakura-canon-bible.md`
- Game design: `docs/design/game-design-bible.md`
- Architecture: `docs/technical/architecture.md`
- Tests: `tests/playwright/smoke.spec.js`
