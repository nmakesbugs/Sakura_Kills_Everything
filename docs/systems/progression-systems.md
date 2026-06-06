# Progression Systems

> Status: Placeholder — Build 1. Concepts only, no implementation.

---

## Design Question

How does Sakura advance in a game where she is already the apex predator of her backyard?

She does not need to get stronger. She needs to get more territory.

---

## Proposed Progression Axes

### 1. Incident Record
Every engagement is logged. The incident record grows. Players can browse it in Sakura Canon mode. The record itself is progression — it is the accumulation of the mythology.

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
