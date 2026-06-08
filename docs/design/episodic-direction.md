# The Episodic Direction (v0.8E)

> Short by design. This is the document that stops the project from drifting back
> into a systems platform. Read it before you build.

## 1. The Tanisha Cut worked

v0.7R ("The Tanisha Cut") was a standalone, authored, playable Sakura comic — one episode,
three choices, a real ending, a screenshot-worthy report. It was playtested. It worked. It is
the first version that felt like *a lovingly made Sakura game* instead of a systems demo.

So we are committing to it.

## 2. The product is now authored Sakura episodes

**Sakura Kills Everything is a collection of authored comic episodes.** The player-facing
product is the **Backyard Incident Files** — pick an incident, play a 3–5 minute comic, get an
official report. That's the whole shape.

The operating model is **no longer**: Duck Hunt, Patrol, a mode selector, an archive-first
platform, or a systems-first incident engine. Those were the old face. They are demoted.

## 3. The old mode-platform is demoted, not deleted

- The old mode selector lives at `legacy/index.html`, clearly marked "reference only."
- The old runtime (`src/modes/*`, `src/engine`, `src/data`, `src/ui`, `src/utils`) is still on
  disk and still tested, but it no longer defines the product. Don't build new gameplay there.
- The root `index.html` now routes to `episodes/index.html`. The mode selector is **not** the
  main product face anymore.

## 4. The old lore/canon is source material, not architecture

`docs/canon/*` (~21k words) is a gift: characters, geography, creatures, organizations, the
laws of the world. **Use it as seasoning, not homework.** A line of flavor ("The squirrel made
eye contact from the fence. This was unnecessary.") beats a paragraph of org-chart lore. Never
lore-dump in an episode.

## 5. Each episode is built for a person, for a smile

The first audience is the family — specifically **Tanisha**, the original Witness. Build each
episode to make a specific person laugh. Tanisha appears in every episode as the witness /
reluctant validator, and her witness note is a featured part of the final report.

## 6. The official report is the payoff, not the whole game

The report (Official Interpretation vs. Likely Reality + Tanisha's note + an outcome stamp +
case number + status line) is the screenshot you want someone to send a friend. It is the
*ending*, earned by the comic that preceded it — not a data dump, and not the gameplay itself.

## 7. Episode 2 proves the format beyond the Bird Incident

**Squirrel Surveillance** is the second episode. It exists to prove the pattern repeats:
distinct creature (a smug, untouchable squirrel), distinct joke (Sakura is certain a crime is
underway; she conducts surveillance; the squirrel escapes — *always*, per canon), distinct
verbs (surveil / charge / pretend not to care), distinct report (squirrel status: **Uncaught**,
forever). Same shell, same warmth, new story.

## 8. Episode 3 proves the *toy* can change (v0.9E)

**Rabbit at the Garden Frontier** keeps the episode structure (intro → witness → middle →
report) but swaps the middle interaction: instead of a timed action it has a small **5-node
chase map** (Patio / Garden / Grass / Bushes / Fence Line). The player picks Sakura's route
each round, the rabbit flees on a simple weighted graph, and route choices + a leaf-diversion
complication steer one of four outcome families. The lesson: **the shell is shared, but the
"middle toy" is per-episode.** Each episode should make the player think *"oh, this one plays
differently."* Keep new toys local to the episode folder (Rabbit's map lives in
`episodes/rabbit-frontier/episode.{js,css}`) unless they're clearly reusable. Don't build a
generic map/engine.

## 9. Episode 4 proves the toy can be a *mystery* (v1.0E)

**Vorg Watch** swaps the toy again: an **evidence board**. The player examines 3 of 5 clues,
**classifies** each (badly), and a comic **Concern Level** meter climbs (Calm → … → Vorg Watch
Activated) no matter what — then files one of four official theories. The point is not to solve
anything: **the Vorg is never confirmed** (status is always an "Unconfirmed" variant). Four
toys now, four rhythms — strike (Bird), monitoring (Squirrel), chase map (Rabbit), investigation
board (Vorg). That's the proof the direction is real. **v1.0E = v1.0 of the episodic prototype
direction**, not a commercial release. Episode 5 should invent *its own* toy, not reuse one.

---

## How an episode is built (the repeatable pattern)

```
episodes/
  index.html                  ← the Backyard Incident Files (product face)
  index.css
  shared/
    episode-shell.css         ← the comic look (palette, scenes, tokens, report card)
    episode-shell.js          ← window.SakuraEpisode: render(), scene primitives, report()
  bird-incident/
    index.html  episode.js    ← Episode 1 (story + choices + reports)
  squirrel-surveillance/
    index.html  episode.js    ← Episode 2
```

- **The shell is a helper, not an engine.** It owns chrome (panel render, progress bar, scene
  primitives, the report card). It must stay small and readable. Resist building a generic
  episode engine — if you find yourself adding configuration, stop.
- **The episode file is the story.** Anyone should be able to open `episode.js`, read the
  `BRANCH` object, and understand the whole episode. Keep the prose in the episode, not in
  config buried in the shell.
- **Each episode is ~10–14 beats**, three meaningful choices, one simple comic action moment
  (never a reflex challenge — it supports the joke), and three distinct screenshot-worthy
  reports.

## Sakura visual policy (still in force)

Real Sakura photo only as a **static, framed portrait/badge** (episode opener, index). Never
animate the real photo in gameplay. In-scene Sakura is symbolic — paws 🐾, motion streaks,
bursts, stamps. "It is better to show less Sakura than to show bad Sakura."

## To build the next episode

Copy `squirrel-surveillance/`, rewrite `episode.js`'s `BRANCH` + beats for the new incident,
add a card to `episodes/index.html` (and the root `index.html`), and add a spec mirroring
`squirrel-surveillance.spec.js`. That's it.
