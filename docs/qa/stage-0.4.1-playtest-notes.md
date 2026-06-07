# Stage 0.4.1 — Playtest Notes (Runtime Experience Rescue)

> **The lesson of Stage 0.4:** 51/51 automated tests passed, and the product still failed a
> human playtest. Tests proved the *systems* worked; they could not see that the *runtime felt
> awful*. From now on, a stage is not "done" because tests pass — it is done when it has been
> looked at and played.

## What felt bad before (0.4)

- **Duck Hunt — the cursed Sakura.** The real photo (Sakura lying on a couch) was pasted at
  the bottom-center of the play field as a "hunter" and scaled/translated on every pounce. It
  looked like a broken cutout, not a game character. This was the single worst offender.
- **Targets were bare floating emoji** in thin rings at random positions, up to 3 at once,
  with short lifetimes — noisy, cramped, unclear what to tap.
- **Too much going on:** full-screen gold flash, screen shake, toasts, particles, *and* the bad
  photo, all at once.
- **Wrong copy:** the status line read "Patrol live" / "Patrol concluded" **in Duck Hunt**
  (shared voice lines), which read like a bug.
- **After-action report = paperwork wall:** every run immediately dumped a stack of full
  incident cards, burying the joke (official vs. likely) under scrolling.
- **Patrol** had the same cursed photo shrunk to a ~46px bouncing marker on the trail.

## What changed in 0.4.1

- **Duck Hunt rebuilt as a clean target range.** One target breaks cover at a time as a
  **circular target chip** with a telegraph ring; tap it to resolve. Calmer pacing
  (14 targets, ~1.3–1.7s each). The field is clean sky/grass with no clutter.
- **No photo in gameplay.** Sakura's action is the **"Sakura Strike"**: a paw-print pop + a
  colored outcome ring (gold/sage/warn/blue/purple). A small **circular face-cropped portrait**
  sits in the HUD only. (See `docs/assets/sakura-runtime-visual-policy.md`.)
- **Restrained FX:** strike + one ring per hit; feathers only on bird catches; dust on misses.
  Removed the full-screen flash and screen shake.
- **Copy fixed:** neutralized the "Patrol"-specific lines so Duck Hunt reads correctly.
- **Report is summary-first:** prominent Official Interpretation, Likely Reality as the
  italic punchline, three score chips, a prominent **File Official Report** button, and
  incidents **collapsed** behind a "View N incidents ▾" toggle (compact rows → detail modal).
- **Patrol:** the photo marker is replaced by a clean circular **🐾 token**; its report uses
  compact rows instead of a card wall.

## Why the new version should feel better

- A new player understands Duck Hunt in seconds: one thing appears, you tap it, you get
  immediate symbolic feedback and a one-line status.
- Nothing on screen looks broken — the visuals are simple and intentional.
- The funniest artifact (official vs. likely) is now the first thing you read after a run, not
  the last thing you reach after scrolling.

## Remaining risks / what needs human playtest next

- **Emoji as target glyphs** still carries some "silliness"; on some platforms they render flat.
  A real sprite/icon set (Stage 0.5) would elevate it further.
- **Pacing** (target lifetime/gap, run length of 14) is tuned by feel, not by a real player on
  a real phone. Needs a touch playtest.
- **Difficulty/score** is shallow by design for a first playable; replayability beyond a few
  runs is unproven.
- Symbolic Sakura is a stopgap; the real win is a clean sprite pipeline that still honors the
  visual policy.

**Verdict to confirm by hand:** is Duck Hunt now *pleasant* for 30–60 seconds on a phone, and
does the report make you smile? Automated tests say it runs; only a human can say it's fun.
