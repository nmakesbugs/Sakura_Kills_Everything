# Hunting Systems

> Status: Placeholder — Build 1. Concepts only, no implementation.

---

## Core Concept

All game modes share a common hunting logic layer. This document defines that layer.

The hunting system answers three questions:
1. What appears in the backyard?
2. How does Sakura engage it?
3. What is the outcome?

---

## Appearance Logic (To Be Designed)

Creatures appear based on:
- **Zone** — Rabbits appear in the Garden Sector. Squirrels use the Fence Line.
- **Time pressure** — How long until the creature escapes or disappears?
- **Spawn weight** — Squirrels appear more often. Vorgs: conditional.

---

## Engagement Model (To Be Designed)

Options under consideration:
- Tap-to-chase: player taps creature, Sakura launches
- Swipe-to-direct: player swipes toward target
- Timing window: tap in the right moment during approach
- Auto-pursue with player-guided steering

The correct model may differ by game mode. Duck Hunt uses one input model; Patrol might use another.

---

## Outcome Determination (To Be Designed)

Outcomes should never be purely random. They should feel earned or appropriately absurd:
- **Engagement success** — Creature routed, zone secured
- **Close miss** — Creature escaped to fence line, area cleared anyway
- **Spectacular failure** — Sakura committed fully; the squirrel was simply faster; honor preserved
- **Vorg event** — Something else happened. Not a squirrel.

---

## Canon Constraints

- Sakura does not catch squirrels. The game may allow near-misses but not routine squirrel catches.
- Sakura has caught birds. Bird catches are exceptional outcomes, logged to the incident record.
- All outcomes should have canon-appropriate language.
