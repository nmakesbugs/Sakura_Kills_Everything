# Sakura Sprite Pipeline — v0.1 (Contract)

> What "real Sakura art in gameplay" must satisfy before it can replace the symbolic
> `SakuraPresence` system. v0.1 is the **contract**, not the implementation — the implementation
> is a future stage and must pass a human playtest (see the 0.4 lesson).

## Why this exists

Stage 0.4 proved that dropping the raw couch photo into gameplay looks cursed. Any future
Sakura art must be *produced for gameplay*, not a snapshot reused in place. This doc defines the
bar.

## Current state (v0.1)

- Gameplay uses **symbolic Sakura**: `SakuraPresence.token` + `outcomeFx` (paw strike, rings,
  feather/dust bursts). See `sakura-runtime-visual-policy.md`.
- The real photo appears only as a **static framed portrait** (home / HUD / report) via
  `SakuraPresence.portrait`.

## Required states (when real sprites arrive)

A sprite set should provide, at minimum, cleanly-framed assets for:

| State | Use |
|---|---|
| `idle` | resting / between targets |
| `alert` | a target has broken cover |
| `trot` | Patrol movement along the trail |
| `pounce` | engaging a target |
| `victory` | a confirmed catch (the rare bird) |
| `confused` | a false alarm / a squirrel that got away |

## Asset requirements

- **Transparent background** (PNG/WebP) — never a rectangular photo with a room behind it.
- **Consistent crop, scale, and lighting** across states so swapping frames doesn't jump.
- **Normalized anchor** (e.g. feet/center) so placement is predictable.
- Mobile-weight: each state small; total set within the performance budget (no framework, no
  bundler). Prefer a single sprite sheet or a handful of optimized images.
- A **CSS silhouette fallback** for any missing state (the policy's "less Sakura beats bad
  Sakura").
- **No couch-photo runtime usage.** No AI-generated dog images. No fake assets.

## Integration contract

When sprites exist, they plug into `SakuraPresence` behind the same API:
- `portrait()` may optionally use a clean cutout instead of the photo crop.
- `token()` may be replaced by an `idle`/`alert` sprite.
- `outcomeFx()` may layer a `pounce`/`victory` frame on top of the existing rings/bursts.

Modes should not change — they already call `SakuraPresence`. That is the point of v0.1: build
the seam now so the art can drop in later without touching gameplay code.

## Acceptance (future stage)

Real sprites ship only when: assets meet the requirements above, they're wired through
`SakuraPresence`, the performance budget holds, and a **human playtest** confirms they look
better than the symbolic system — not merely that tests pass.
