# Game Design Bible

---

## Game Pillars

### 1. Canon First
Every mechanic must be grounded in real Sakura behavior. If Sakura would not do it, the game should not let the player do it. The game earns its absurdity through faithfulness to reality.

### 2. The Hunt is Earnest
Sakura does not wink at the camera. She is genuinely trying to catch these squirrels. The humor comes from commitment, not irony.

### 3. Family Audience (Allowed to Bite)
A 7-year-old and a grandparent should be able to play together. The game is called *Sakura
Kills Everything* — cartoon-mythic violence (feather bursts, dust clouds, "bird neutralized,"
"kill mode") is welcome; realistic gore, cruelty, and animal suffering are not. All fun should
be the kind that gets described at dinner. See `tone-and-voice.md`.

### 6. Incidents Are the Atomic Unit
The game is not mainly about score — it is about **generating incidents**, each carrying the
sacred dual layer (official interpretation vs. likely reality). Every mode is an incident
factory; the Canon Archive preserves them. See `docs/systems/incident-system.md` and
`core-gameplay-loop.md`.

### 4. Failure is Funny, Not Punishing
Sakura will fail to catch squirrels. This is expected. The game should celebrate spectacular misses as much as occasional victories.

### 5. Mobile First
The game is played on a phone, probably while the real Sakura is outside doing something. Tap-friendly, portrait-optimized, sessions under 5 minutes.

---

## Core Loop (Conceptual)

```
Briefing → Detection → Stalking → Pounce → Outcome
→ Official Interpretation + Likely Reality → Incident Report
→ Reputation/Memory → Next Hunt
```

The full ten-beat loop is specified in `docs/systems/core-gameplay-loop.md`. Implemented in
Stage 0.2 via `src/engine/incident-engine.js`.

---

## Five Modes

See `mode-overview.md` for full descriptions.

- **Duck Hunt** — Tap-to-engage aerial targets
- **Patrol** — Side-scroller perimeter sweep
- **RPG Hunt** — Turn-based strategic campaign
- **Chaos Mode** — Unpredictable everything
- **Sakura Canon** — Read-only incident archive

---

## What This Game Is Not

- Not grim or gory. Violence is cartoon-mythic (feathers, dust, medals) — never realistic
  harm, cruelty, or suffering.
- Not a cold collection grind. The product is *incidents and stories*, not a kill count.
- Not a generic mobile arcade game with a dog skin.
- Not a game where Sakura can fail permanently. Failure is funny, not punishing.
- Not a game where the backyard is abstract or generic.

---

## Monetization

None planned. This is a family game, not a product.

---

## Success Definition

The family plays it together and recognizes Sakura in every mechanic.
