# Hunting Systems

> Status: **Implemented for Duck Hunt (Stage 0.2).** The three questions below are realized in
> code: spawn weights in `src/modes/duck-hunt/duck-hunt.js` (`KINDS`), outcome enforcement in
> `src/engine/incident-engine.js` (`resolveOutcome`). See `core-gameplay-loop.md` and
> `incident-system.md`.

---

## Core Concept

All game modes share a common hunting logic layer. This document defines that layer.

The hunting system answers three questions:
1. What appears in the backyard?
2. How does Sakura engage it?
3. What is the outcome?

---

## Appearance Logic (Implemented — Duck Hunt)

Creatures appear based on:
- **Zone** — Rabbits appear in the Garden Sector. Squirrels use the Fence Line. (`src/data/zones.js`)
- **Time pressure** — Targets live ~1.7–2.6s, then escape. Up to 3 concurrent, 16 per run.
- **Spawn weight** — squirrel 0.30, bird 0.28, rabbit 0.18, false-alarm 0.16, vorg 0.08.

---

## Engagement Model (Implemented — tap to engage)

Duck Hunt uses **tap-to-engage**: tap a target to commit Sakura (pounce + impact effect); an
untapped target times out (escape). Mobile-simple, no physics, fully testable. Other modes may
use a different input model (Patrol may use steering), but all resolve through the same engine.

---

## Outcome Determination (Implemented — `resolveOutcome`)

Centralized in `window.SakuraIncident.resolveOutcome(kind, didHit, creature)`, the single
chokepoint where canon is enforced. Returns `{ outcomeType, violenceLevel, comedyType, points }`.
Outcomes feel earned or appropriately absurd:
- **Feather event / confirmed catch** — birds; airspace cleared by force
- **Close miss** — rabbit hit becomes a near miss; bird miss escapes
- **Squirrel escape** — always; honor preserved, institution embarrassed
- **Vorg non-confirmation** — something else happened; never a squirrel, never confirmed

---

## Canon Constraints

- Sakura does not catch squirrels. The game may allow near-misses but not routine squirrel catches.
- Sakura has caught birds. Bird catches are exceptional outcomes, logged to the incident record.
- All outcomes should have canon-appropriate language.
