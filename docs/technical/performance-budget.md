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

## Stage 0.3 Status

Within budget. The home screen adds one real Sakura photo (~207kb JPG, lazy on a single
screen). Duck Hunt and Patrol are both **DOM/CSS-based** (no heavy canvas, no physics): targets
and encounters are elements, effects are short CSS animations using `transform`/`opacity`,
particles are removed after ~650ms. The data + engine + ui + storage layer is small plain JS
with no dependencies. Persistence is `localStorage` only (capped at 200 incidents). No
frameworks, no bundler, no network calls after load, no audio/video this pass.

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
