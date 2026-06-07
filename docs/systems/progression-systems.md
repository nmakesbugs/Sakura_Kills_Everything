# Progression Systems

> Status: **Partially implemented (Stage 0.2).** Per-run prestige + prestige ranks are live
> (`incident-engine.summarizeRun`); persistent cross-run progression (`ske-progress-v1`,
> `ske-incidents-v1`) is the headline feature of Stage 0.3.

---

## Design Question

How does Sakura advance in a game where she is already the apex predator of her backyard?

She does not need to get stronger. She needs to get more territory.

---

## Proposed Progression Axes

### 1. Incident Record
Every engagement is logged. The incident record grows. Players can browse curated incidents in
Sakura Canon mode today; runs generate fresh incidents now and will persist them in 0.3. The
record itself is progression — the accumulation of the mythology. A per-run **prestige** score
and **prestige rank** (Backyard Skirmisher → Mythic Backyard Warlord) are already live.

### 2. Zone Unlocks
The Unknown Regions cannot be accessed until enough fence line patrols have been completed. The far reaches of the backyard open as play continues.

### 3. Vorg Investigation Progress
A separate tracker for vorg-related incidents. Fills slowly. Does not resolve until the family decides what vorgs are.

### 4. Seasonal Events
The backyard changes by season. New creatures appear. Old ones return. Sakura's prey hierarchy shifts slightly in winter.

---

## What Progression Is Not

- Sakura does not level up her speed or strength. She is already at maximum commitment.
- Progression is not about becoming a better hunter. She is already hunting at 100%.
- No purchasable upgrades. This is not that game.

---

## Implementation Note

Progression data will live in `localStorage` following the same pattern as sibling project Caldoon Campaign. Key format: `ske-progress-v1`.
