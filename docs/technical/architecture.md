# Architecture

---

## Stack

**Vanilla HTML/CSS/JavaScript.** No framework, no bundler, no build step.

This matches the pattern established in sibling project Caldoon Campaign. The reasons:

- Zero setup friction — open `index.html` in a browser, the app runs
- No dependency rot — the code will work in 3 years without `npm install` surprises
- Family game — the code should be readable by someone who learned JavaScript once
- Build complexity is not the bottleneck; gameplay ideas are

---

## Entry Point

`index.html` — the home screen. Open this file directly in a browser or via `file://` protocol.

No server required. Playwright tests load it via `file://` with `--allow-file-access-from-files`.

---

## File-Based Routing

Navigation between screens is plain HTML links (`<a href="...">`). Each mode is a separate HTML file:

```
index.html                          ← home screen
src/modes/duck-hunt/index.html      ← duck hunt mode
src/modes/side-scroller/index.html  ← patrol mode
src/modes/rpg/index.html            ← rpg hunt mode
src/modes/chaos/index.html          ← chaos mode
src/modes/canon/index.html          ← sakura canon
```

No JavaScript router. No hash routing. No SPA. The back button works because it is just the back button.

---

## State Persistence

Game state is persisted to `localStorage`. Key format: `ske-{feature}-v1`.

Example keys:
- `ske-progress-v1` — overall game progress
- `ske-incidents-v1` — logged incident record
- `ske-canon-v1` — discovered canon entries

State is not required for the home screen or canon archive. It is optional progressive enhancement.

---

## Source Directory Structure

```
src/
  app/      — app-level concerns (if shared layout emerges)
  engine/   — future game engine (creature spawning, event tables)
  modes/    — one directory per game mode
  data/     — static data (creature tables, event tables, map data)
  assets/   — sprites, audio, backgrounds
  ui/       — shared UI components (button styles, status bars)
  utils/    — utility functions (localStorage helpers, etc.)
```

In Build 1, most of these directories contain only placeholder stubs.

---

## Testing

Playwright, headless Chromium, `file://` protocol. See `testing-plan.md`.

No unit tests in Build 1. Unit tests will be added when the engine has testable logic.

---

## When To Add a Build Step

When one of the following is genuinely needed:
- Asset optimization pipeline that cannot be done manually
- Module bundling because files have become large enough to matter
- TypeScript or other transpilation with broad team consensus

Not before.
