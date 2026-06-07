# Stage 0.5 — Runtime Feel + Sakura Visual Pipeline (Playtest Notes)

> Follows the 0.4 lesson: a stage is not done because tests pass — it is done when the runtime
> has been looked at and played. These notes record the manual inspection that drove this pass.

## 1. What failed in the previous playtest (0.4)

Duck Hunt felt bad: the real Sakura photo was animated as a gameplay sprite (cursed couch
cutout), targets were bare floating emoji, effects were noisy (full-screen flash, shake), and
the report dumped a wall of cards. 0.4.1 already rebuilt Duck Hunt and removed the cursed photo;
this pass elevates the result and builds the reusable visual system.

## 2. What was manually inspected this time (390×700 mobile)

Home, Duck Hunt briefing, Duck Hunt active play, Duck Hunt after-action report, Patrol map,
Patrol encounter, Canon Archive. Findings going in:
- Home/report/archive: clean and good.
- Duck Hunt active play: clean but **barren** — one small target in a large empty gradient.
- Effects/portrait were **inline** in Duck Hunt, not reusable.

## 3. What changed in Duck Hunt

- **Field has dignity now:** a dusk gradient with a moon, a fence-line silhouette, a ground
  band, and bush silhouettes — it reads as a backyard, not a void.
- **Targets bigger & clearer:** 88px circular chips with a telegraph ring; obviously tappable.
- **Pacing more generous:** 12 targets, ~1.7–2.2s lifetimes, ~0.5–0.76s gaps, gentle 0.7s
  lead-in. One target at a time. ~30–40s run.
- **Feedback via SakuraPresence:** a paw "Sakura Strike" + a colored outcome ring; feathers on
  bird catches, dust on misses, an escape streak for squirrels, an alert pulse for vorg. No
  full-screen flash, no shake.
- Report unchanged in structure (summary-first, collapsed incidents) but now carries a small
  static Sakura portrait badge in the header.

## 4. What changed in Sakura visuals

- New shared **`SakuraPresence`** system (`src/ui/sakura-presence.{css,js}`): `portrait()` (safe
  static photo), `token()` (symbolic gameplay marker), action effects, and `outcomeFx()`.
- Duck Hunt's HUD/start/report portraits and ALL field effects now come from it. The play field
  contains **no photo** (verified by test). Patrol's report carries a portrait badge; its trail
  marker is a clean paw token consistent with `.sp-token`.
- Documented in `sakura-runtime-visual-policy.md` and `sakura-sprite-pipeline-v0.1.md`.

## 5. Why the new runtime should feel better

- The field looks like a place, not a test harness. The target is big and unmistakable.
- One clear feedback moment per tap (strike + ring + one short status line).
- Pacing is generous enough to learn on the first run.
- Sakura is *present* (HUD portrait + paw strikes) without any cursed animated photo.

## 6. Remaining risks

- Targets are still emoji glyphs (render flat in headless; full-color on device). The
  `SakuraPresence` seam is ready for real sprites, but they don't exist yet.
- Pacing/feel is tuned by eye in a desktop browser at a phone viewport — **not** yet on a real
  touch device. Numbers may need adjustment.
- Replayability past a few runs is unproven; this is still a first playable.

## 7. What Nick should test on a phone

- Is the target easy to tap with a thumb? Is 88px big enough / too big?
- Does the run length (12 targets) feel right, too long, or too short?
- Does the strike + ring feedback feel satisfying, or still flat?
- Does the report read as funny-first, not paperwork?
- Do the emoji targets look acceptable on your device, or do we need real icons sooner?

## 8. Ready for a family playtest?

**Close, with a caveat.** It is no longer embarrassing and is genuinely clearer and more
dignified than the failed version — good enough to put in front of family for *feedback*. But it
should be touched on a real phone first to confirm tap feel and pacing. If that check passes,
it's ready for a casual family playtest; if tap feel is off, one more small tuning pass before
showing it around.
