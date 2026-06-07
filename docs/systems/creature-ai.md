# Creature AI

> Status: **Partially encoded (Stage 0.2).** Creature behavior traits now live as data in
> `src/data/creatures.js` (`movementStyle`, `behaviorTags`, `catchable`, `threatLevel`), and
> Duck Hunt expresses them through spawn behavior and outcome bias. Full per-creature movement
> AI is a future-mode concern. The philosophy below remains the design intent.

---

## Design Philosophy

Creatures in this game should feel like they know what they're doing.

The squirrels are not stupid. They have been surviving Sakura for years. They have learned her patrol patterns. They know about the fence line. They are organized in a way that is concerning.

The AI should reflect this.

---

## Per-Species Behavior Philosophy

### Squirrels
- Use the fence line as an escape route when Sakura approaches
- May hesitate briefly before fleeing (overconfidence — this is canon)
- Reappear after a cooldown; they do not stay gone
- Higher engagement count = slightly more evasive behavior over time

### Rabbits
- Use stillness as first defense
- Explosive movement when committed to fleeing
- Prefer Garden Sector cover
- Do not use the fence line (that's the squirrels' infrastructure)

### Birds
- Aerial movement; not bound by ground zones
- Fast traversal; engagement windows are short
- Occasional hover (gulls, maybe crows) that extends the window

### Vorgs
- Behavior undefined until existence confirmed
- Placeholder: if vorg spawns, it disappears before engagement
- This may not be the game's fault

---

## Implementation Note

Creature AI will be implemented per game mode, not as a shared engine. Duck Hunt birds behave differently than RPG squirrels. The philosophy above applies to both, but the implementation lives in mode-specific code.
