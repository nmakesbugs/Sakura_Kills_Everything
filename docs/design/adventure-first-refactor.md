# The Adventure-First Refactor (Stage 0.6)

> Why the product pivoted from "select a game mode" to "choose a Sakura adventure," and what
> "good" means now.

## Why this happened

By Stage 0.5 the platform was strong — canon, incident engine, storage, Permanent Record,
SakuraPresence, Duck Hunt, Patrol, 57 passing tests. And the human verdict was still: **boring.**

The framework was reasonable. The concept was good. The *experience* was a tech demo: tap a
target, generate an incident, repeat. Mode-first arcade made the player do mechanics, not live a
Sakura story. The funniest thing in the whole project — the official record vs. likely reality —
was a byproduct, not the point.

## The pivot

**Old frame:** "Select Hunting Mode" → target appears → tap → incident.
**New frame:** "Choose Sakura's Next Adventure" → briefing → choices → complication → strike →
aftermath → official report → file.

The player's goal is no longer score. It is **to produce the funniest official record of
Sakura's version of events** and want to show it to someone.

## Why mode-first was boring

- No stakes, no setup, no payoff — just a loop.
- Choices didn't exist; the player executed timing, not story.
- Sakura's personality (sincere, vicious, gloriously unreliable) had nowhere to express itself.
- The report — the best asset — arrived without a story behind it, so it didn't land.

## Why authored adventures are the flagship

- A 3–6 minute episode has a beginning, middle, and end. It *is* a story.
- Choices (observation post, approach, the strike) shape the report, so replay is curiosity-
  driven: "what happens if Sakura charges immediately?"
- Sakura's character lives in the writing and the choices, not in a tap.
- The report is now a *payoff*, earned by the run — the thing you screenshot for Tanisha.

The first episode, **The Bird Incident**, is the test of the whole thesis: *can Sakura Kills
Everything be fun as an authored family adventure?* It is the new home-screen call to action.

## How the old modes fit now

- **Duck Hunt → "Practice Yard" (Bonus).** Still playable, no longer the flagship, not a focus.
- **Patrol → "Free Patrol" (Prototype).** Still available; not the primary experience.
- **Canon Archive → "Permanent Record" (Live).** Supports the adventures — it's where filed
  reports accumulate into family mythology. It is not the game itself.

## What "good" means for a Sakura adventure

1. A human understands why the game exists within one playthrough.
2. Choices visibly change the official record.
3. The strike is the *climax of a story*, not a random target.
4. Even failure produces a funny, file-worthy report.
5. Tanisha would smile, and want to show Nick or the kids.
6. Canon laws hold: squirrels uncaught, vorg unconfirmed, dual-layer reports, lovable Sakura.

## Architecture (kept deliberately small)

- `src/data/adventures.js` — the adventure registry (home cards, future episodes).
- `src/adventures/<id>/{index.html,<id>.js}` — one self-contained episode; a tiny beat state
  machine that authors content and reuses the platform.
- Episodes reuse `SakuraIncident` (schema), `SakuraStorage` (filing with `sourceAdventure`),
  `SakuraPresence` (visuals), `SakuraUI` (rows/modal in the archive).

No generic adventure framework was built — just enough shape for the next episode to copy the
pattern. Build episodes, not engines, until a second one proves the shared needs.
