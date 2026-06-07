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
**Status:** 🟢 Playable (Stage 0.2)
**Location:** `src/modes/duck-hunt/`

The first true playable. A short run (16 targets) of tap-to-engage backyard warfare. Targets
appear and disappear; the player taps to launch Sakura; outcomes resolve through the incident
engine and the run ends in an **after-action report** with the official-vs-reality dual layer.

- **Target types:** birds (catchable, feather-burst), rabbits (escape-biased, near-miss),
  squirrels (always escape — canon), false alarms (leaves/bags/shadows — won anyway), and
  rare vorg signs (non-confirmation only).
- **Produces:** fast incidents.
- **Core feel:** quick, funny, vicious-but-loving. Sakura launches herself at things.
- **Win condition:** there is no losing. Every run files a glorious report.

---

## Sakura Canon
**Status:** 🟦 Live (Stage 0.2)
**Location:** `src/modes/canon/`

An in-game archive portal — no longer a placeholder. Departments link to the full canon
(`docs/canon/`), and a "Selected Incidents" section renders real incident cards from
`src/data/incidents.js`.

- **Produces:** preserves incidents (the permanent collection).
- **Core feel:** an official archive run by people who find Sakura's testimony unreliable.
- **Access:** always available; never requires unlocking.

---

## Patrol
**Status:** ⚪ Future
**Location:** `src/modes/side-scroller/`

Side-scrolling perimeter sweep. Sakura moves along the fence line, detecting and responding to
threats across zones.

- **Produces:** exploration incidents.
- **Core feel:** methodical urgency — a security sweep that keeps finding more problems.
- **Reuses:** the same incident + voice engines, with detection/positioning beats stretched.

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
`window.SakuraUI`, and pulls from `window.SakuraData`. Build gameplay once in the platform;
dress it per mode. Canon preserves whatever the modes produce.
