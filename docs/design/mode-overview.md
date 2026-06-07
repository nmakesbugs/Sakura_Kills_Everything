# Mode Overview

> All modes are incident factories running the shared core loop at different tempos.
> See `docs/systems/core-gameplay-loop.md`.

---

## Build Status Key

| Status | Meaning |
|---|---|
| 🟢 Playable | A real, replayable mode |
| 🟦 Live | Non-game feature that works in-app |
| 🟡 In Progress | Under active development |
| ⚪ Future | Themed placeholder; designed, not built |

---

## Duck Hunt
**Status:** 🟢 Playable (since 0.2; files reports since 0.3; **rebuilt 0.4.1**)
**Location:** `src/modes/duck-hunt/`

The first true playable, **rebuilt in 0.4.1** after a playtest found the original noisy and the
animated Sakura photo cursed. Now a clean target range: **one target breaks cover at a time**
as a circular chip with a telegraph ring; tap it to send Sakura. Feedback is **symbolic** — a
"Sakura Strike" paw + a colored outcome ring (no in-game photo; a small static portrait sits in
the HUD only). Outcomes resolve through the incident engine; the run ends in a **summary-first
after-action report** (Official Interpretation prominent, Likely Reality the punchline,
incidents collapsed behind a toggle). See `docs/assets/sakura-runtime-visual-policy.md`.

- **Target types:** birds (catchable, feather-burst), rabbits (escape-biased, near-miss),
  squirrels (always escape — canon), false alarms (leaves/bags/shadows — won anyway), and
  rare vorg signs (non-confirmation only).
- **Produces:** fast incidents.
- **Core feel:** quick, funny, vicious-but-loving. Sakura launches herself at things.
- **Win condition:** there is no losing. Every run files a glorious report.

---

## Sakura Canon
**Status:** 🟦 Live (since 0.2; Permanent Record + stats since 0.3; filters/grouping/detail-view/territory-stats since 0.4)
**Location:** `src/modes/canon/`

An in-game archive portal — no longer a placeholder. Departments link to the full canon
(`docs/canon/`), and a "Selected Incidents" section renders real incident cards from
`src/data/incidents.js`.

- **Produces:** preserves incidents (the permanent collection).
- **Core feel:** an official archive run by people who find Sakura's testimony unreliable.
- **Access:** always available; never requires unlocking.

---

## Patrol
**Status:** 🟦 Playable Prototype+ (Stage 0.3; zone map added 0.4)
**Location:** `src/modes/side-scroller/` (user-facing name: **Patrol**)

Surveillance, not reaction. The player picks a **sector** from the **backyard zone map**
(a schematic 2×2 board built from `src/data/zones.js`, showing danger, known creatures, and
filed-report counts per sector), then Sakura sweeps it encounter by encounter (6 per patrol).
Each encounter offers four actions — **Investigate, Stalk, Pounce, Report** — and resolves
through the **shared** incident engine (`SakuraIncident.resolvePatrol`). The patrol ends in an
after-action report that can be filed to the permanent record; the player then returns to the
sector map (filed counts update).

- **Produces:** exploration incidents — squirrel escapes, rabbit chases, false alarms,
  environmental misidentifications, vorg non-confirmations, and the occasional legit victory.
- **Core feel:** methodical, investigative; slower than Duck Hunt.
- **Reuses:** the same incident + voice + storage layer. No separate data model. It is a
  prototype, deliberately — not a finished side-scroller.

---

## RPG Hunt
**Status:** ⚪ Future
**Location:** `src/modes/rpg/`

Turn-based strategic campaign. Sakura builds reputation, unlocks zones, interrogates squirrels
(noncommittal), and pursues the long mystery of The Unknown Regions.

- **Produces:** quest incidents.
- **Core feel:** deliberate; the backyard has depth and a larger story.
- **Win condition:** ongoing, as it should be. The vorg is never resolved.

---

## Chaos Mode
**Status:** ⚪ Future
**Location:** `src/modes/chaos/`

Unpredictable, unstructured, loud. Many loops at once; incidents cascade and interact.

- **Produces:** cascading incidents.
- **Core feel:** everything is happening; Sakura is handling it.
- **Win condition:** survival. The yard is still standing. At least one vorg alert.

---

## How modes relate

Every mode calls `window.SakuraIncident` and `window.SakuraVoice`, renders results with
`window.SakuraUI`, pulls from `window.SakuraData`, and files results through
`window.SakuraStorage`. Build gameplay once in the platform; dress it per mode. The Canon
Archive's Permanent Record preserves whatever the modes file (`ske-incidents-v1`).
