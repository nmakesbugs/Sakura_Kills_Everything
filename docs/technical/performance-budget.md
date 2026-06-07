# Performance Budget

> This is a mobile game. The player is probably outside, on cellular, watching a real dog.
> It must be fast.

---

## Targets

| Metric | Target | Notes |
|---|---|---|
| Initial HTML load | < 50kb | Uncompressed |
| Total home screen weight | < 100kb | Including any inline CSS/JS |
| Time to interactive (4G) | < 3 seconds | No server; file:// load is faster |
| First paint | < 1 second | Aim for near-instant |
| CSS animations | 60fps | No jank; use `transform` and `opacity` only |
| Canvas frame rate | 60fps | For active gameplay modes |
| localStorage operations | < 5ms | No blocking reads on load |

---

## Mobile Targets

| Device | Target |
|---|---|
| iPhone 12 or newer | Flawless |
| iPhone SE (2020) | Fully playable |
| Mid-range Android (2022) | Fully playable |
| Older devices | Graceful — game works, animations may simplify |

---

## What Would Break This Budget

- External web fonts (avoid unless critical)
- Large unoptimized images (optimize all photos before adding)
- Synchronous localStorage reads on load (read async or after paint)
- CSS animations using `width`, `height`, `top`, `left` (use `transform` instead)
- Large JavaScript files without tree-shaking (we have no bundler — keep JS small)

---

## Stage 0.4.1 Status

Within budget, and **lighter than before**. The 0.4.1 rescue *reduced* runtime cost: Duck Hunt
now shows **one target at a time** (was up to 3), dropped the full-screen gold flash and screen
shake, and trimmed particle counts. The real Sakura photo is used only on the home screen and
as a small static HUD avatar — it is **not** animated in gameplay (see
`docs/assets/sakura-runtime-visual-policy.md`). Duck Hunt and Patrol remain **DOM/CSS-based**
(no canvas, no physics); effects are short `transform`/`opacity` animations, particles removed
within ~650ms. Persistence is `localStorage` only (capped at 200). No frameworks, no bundler,
no network after load, no audio/video.

| Area | Status |
|---|---|
| No runtime dependencies | ✅ (Playwright is dev-only) |
| `transform`/`opacity` animations only | ✅ |
| DOM node budget per run | ✅ (≤3 concurrent targets + transient particles) |
| Offline after load | ✅ (no network) |

---

## Monitoring

Still no formal Lighthouse CI. Reassess when a second playable mode (Patrol, 0.3) lands or if
the photo asset budget grows. Keep images optimized before adding.
