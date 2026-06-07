# Sakura Runtime Visual Policy

> Established in Stage 0.4.1 after a playtest revealed that animating the real Sakura photo
> inside gameplay looked **cursed** — a rectangular lying-on-the-couch portrait pasted into a
> "backyard" and bounced around. This policy is binding until a real sprite pipeline (Stage 0.5)
> replaces it.

## The Governing Principle

> **It is better to show less Sakura than to show bad Sakura.**

The real photo is lovely **as a photo**. It is not a sprite. Do not stretch it, cut it out,
float it, or animate it in a play field. A bad Sakura image breaks the spell harder than no
Sakura at all.

## Where the real photo IS allowed

- **Home screen** — the framed portrait (`index.html`). It looks good there. Keep it.
- **HUD avatars** — a small **circular, face-cropped** portrait is allowed (e.g. Duck Hunt's
  40px HUD avatar: `object-fit: cover; object-position: 50% 26%`). Static only. Never animated,
  never large, never the action.

## Where the real photo is FORBIDDEN

- As a gameplay sprite of any kind.
- As an animated element (pounce, trot, bob, scale).
- Stretched, skewed, or cut out against a scene.
- Anywhere it would read as "a floating dog head" or worse.

## Symbolic Sakura (use this in gameplay)

Represent Sakura's *presence and action* symbolically, with intentional CSS:

- **Duck Hunt** — the "Sakura Strike": a paw-print (🐾) pop + an expanding **outcome ring**
  (gold = confirmed, sage = feather win, warn = squirrel escape, blue = false alarm,
  purple = vorg). Plus a small circular HUD portrait (static). No photo in the field.
- **Patrol** — a clean circular **token** (🐾 on an accent disc) that moves along the trail.
  No photo marker.

These read as deliberate handmade game language, not a broken asset.

## Effects budget (keep it restrained)

The 0.4 build was visually noisy. Runtime FX should be **few and legible**:
- One target visible at a time in Duck Hunt; clear telegraph ring on spawn.
- A single strike + a single outcome ring per resolution; feather burst only on bird catches;
  dust only on misses. No full-screen flashes, no screen shake.
- Status: one short line. Long text lives in the briefing, the after-action report, and the archive.

## Future sprite pipeline requirements (Stage 0.5)

When a real Sakura sprite/photo pipeline is built, it must:
- Produce clean, consistently-framed cutouts (transparent, centered, normalized size) — not
  raw photos dropped into scenes.
- Define discrete states (idle, alert, trot, pounce, victory) as separate framed assets.
- Include a CSS silhouette fallback for any missing asset.
- Be reviewed in an actual playtest (not just passing tests) before replacing the symbolic
  presence above.

Until that exists and passes a human playtest, **symbolic Sakura is the standard.**
