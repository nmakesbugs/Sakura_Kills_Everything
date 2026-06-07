# The Incident System

> System canon. Incidents are the atomic unit of Sakura Kills Everything. Every mode
> produces them; the Canon Archive preserves them; achievements and future hooks grow from
> them. This document defines the canonical schema and the resolution rules. Implemented in
> Stage 0.2 (`src/engine/incident-engine.js`, `src/data/incidents.js`).

---

## Why Incidents Are the Core

A score is forgettable. An *incident* is a story: the sacred dual layer of what the official
record claims versus what most likely happened. That gap is the soul of the game (see
`docs/design/narrative-voice-guide.md`). Treat incidents as the product and everything else —
score, effects, modes — as packaging.

---

## The Incident Schema

Every incident — whether a curated museum piece in `src/data/incidents.js` or one generated
live during a run — supports these fields:

| Field | Type | Meaning |
|---|---|---|
| `id` | string | Unique id (`INC-001`, or `run…-i7` at runtime) |
| `title` | string | Short dramatic headline |
| `dateClassification` | string | When, in the realm's loose chronology |
| `zone` / `zoneName` | string | Where it happened (see `src/data/zones.js`) |
| `creatures` | string[] | Creature ids involved (see `src/data/creatures.js`) |
| `factions` | string[] | Factions implicated (see `docs/canon/organizations.md`) |
| `witnesses` | string[] | Family members who saw it (canon authority) |
| `trigger` | string | What set it off |
| `playerAction` | string | What Sakura/the player did |
| `outcomeType` | enum | See **Outcome Types** below |
| `officialInterpretation` | string | The inflated, heroic record |
| `likelyReality` | string | The deflating truth |
| `canonStatus` | string | `canon`, `logged`, `unconfirmed`, … |
| `violenceLevel` | enum | See **Violence Levels** below |
| `comedyType` | string | `found-victory`, `mythic-understatement`, `ominous-footnote`, … |
| `points` | number | Prestige contribution |
| `relatedAchievements` | string[] | Achievement hooks (see achievement-philosophy.md) |
| `relatedHooks` | string[] | Future story-seed ids (see expansion-seeds.md) |

---

## Outcome Types

The closed set of ways an engagement can resolve:

| `outcomeType` | Meaning | Canon note |
|---|---|---|
| `confirmedCatch` | The record considers the matter closed; a confirmed kill (mythic) | Birds only; rare |
| `suspectedCatch` | Probably a catch; unverified | Reserved for ambiguous future modes |
| `featherEvent` | Feathers recovered; airspace cleared by force | Birds; the common "catch" |
| `escape` | The target withdrew | Birds (missed), rabbits |
| `squirrelEscape` | The squirrel escaped, as required by canon | **Always** for squirrels |
| `falseAlarm` | The threat was foliage; victory claimed anyway | Leaves, bags, shadows |
| `vorgNonConfirmation` | An anomaly was logged but never confirmed | **Always** for vorg |
| `environmentalMisidentification` | A mundane thing mistaken for a threat | Cousin of `falseAlarm` |
| `gloriousFailure` | A total triumph by Sakura's metrics only | The found-victory |
| `patrolSuccess` | A genuine, quiet win | Wholesome / Patrol mode |
| `chaosEvent` | A cascading multi-creature incident | Chaos mode |

---

## Violence Levels

Cartoon-mythic violence is allowed and encouraged. Real gore, cruelty, and animal suffering
are not (see `docs/design/tone-and-voice.md`).

| `violenceLevel` | Meaning |
|---|---|
| `harmless` | Nothing was hurt (false alarms, smells, naps) |
| `startled` | A creature was alarmed and left |
| `chased` | An active pursuit (squirrels) |
| `struck` | Cartoon impact — dust cloud, dramatic silhouette |
| `featherBurst` | A bird became feathers; comic abstraction |
| `confirmedKillMythic` | The official record considers the matter closed |
| `unknown` | Vorg / frontier; unclassifiable |

**Critical distinction:** `confirmedKillMythic` does **not** require gore. It means the
*paperwork* is closed. The depiction is feathers, medals, and official language — never blood.

---

## The Dual-Layer Joke (Sacred)

Every resolved incident carries both layers. This is non-negotiable.

> **Official interpretation:** Sakura broke enemy air control over the Western Fence Line.
> **Likely reality:** A robin flew away and several feathers were discovered.

The official line is generated heroic; the likely line is generated honest. The engine
templates live in `incident-engine.js` (`TEMPLATES`), keyed by `outcomeType`.

---

## Resolution Rules (Canon Enforcement)

`incident-engine.resolveOutcome(kind, didHit, creature)` enforces canon at the mechanical
layer so no mode can accidentally violate it:

- **squirrel** → always `squirrelEscape`, hit or miss. Zero confirmed catches, forever.
- **vorg** → always `vorgNonConfirmation`. Never caught, never confirmed.
- **bird + hit** → `featherEvent`, or rarely (`~35%`) `confirmedCatch`.
- **bird + miss** → `escape`.
- **rabbit** → `escape`, escape-biased; a hit becomes a *near miss*, never a catch.
- **falseAlarm** → `falseAlarm`; Sakura "wins" anyway, official inflated, reality mundane.

---

## Run Summary

`incident-engine.summarizeRun(incidents, stats)` aggregates a run into an after-action report:
counts by outcome, total prestige + a prestige rank, a `vorgStatus` line, and a grand
`officialInterpretation` / `likelyReality` pair built from the run's actual composition.

---

## Data vs. Runtime

- **Curated incidents** (`src/data/incidents.js`) are the foundational museum pieces shown in
  the Canon Archive. They are hand-written and canon-true.
- **Runtime incidents** are generated during play by the engine, using the same schema, and
  filed into the run's after-action report. Stage 0.3 will persist these into a
  player-facing archive (`ske-incidents-v1`).
