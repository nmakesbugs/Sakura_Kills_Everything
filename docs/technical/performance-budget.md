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

## Build 1 Status

Home screen is pure HTML/CSS/JS, no images, no external resources. Current estimated weight: ~10kb. Well within budget.

---

## Monitoring

Performance is not formally monitored in Build 1. Add Lighthouse CI integration when the first gameplay mode is complete.
