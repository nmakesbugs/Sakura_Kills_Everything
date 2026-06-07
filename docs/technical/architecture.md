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
  data/     — canon data layer: zones.js, creatures.js, incidents.js, voice-lines.js
  engine/   — random.js, voice-engine.js, incident-engine.js (+ index.js canvas helpers)
  ui/       — theme.css, components.css, incident-card.js
  modes/    — one directory per mode (duck-hunt playable, canon live, others future)
  assets/   — real Sakura photo (no fake images)
  app/      — app-level concerns (stub; reserved)
  utils/    — utility functions (storage.js stub; reserved for ske-* persistence in 0.3)
```

As of Stage 0.2, `data/`, `engine/`, and `ui/` are real and load-bearing. `app/` and `utils/`
remain stubs reserved for Stage 0.3 persistence.

---

## Global Namespaces & Load Order

No bundler, so files attach to `window` globals and load as ordered `<script>` tags. A
gameplay page loads them **data → engine → ui → mode**:

| Global | Provided by | Purpose |
|---|---|---|
| `SakuraData` | `src/data/*.js` | `.zones`, `.creatures`, `.incidents`, `.voiceLines` (+ lookups) |
| `SakuraRandom` | `src/engine/random.js` | seedable RNG helpers |
| `SakuraVoice` | `src/engine/voice-engine.js` | voice-line selection + incident narration |
| `SakuraIncident` | `src/engine/incident-engine.js` | `resolveOutcome`, `createIncident`, `summarizeRun` |
| `SakuraUI` | `src/ui/incident-card.js` | `renderIncidentCard`, `renderInto` |
| `SakuraEngine` | `src/engine/index.js` | canvas/loop helpers (future modes) |

This pattern works identically in a browser and under Playwright on `file://`.

---

## Testing

Playwright, headless Chromium, `file://` protocol. See `testing-plan.md`. As of Stage 0.2 the
engines are tested through the browser via the `window.__duckHunt` test seam and direct
`window.Sakura*` global assertions (page-evaluated), rather than a separate unit runner — this
keeps the no-build promise intact.

---

## When To Add a Build Step

When one of the following is genuinely needed:
- Asset optimization pipeline that cannot be done manually
- Module bundling because files have become large enough to matter
- TypeScript or other transpilation with broad team consensus

Not before.
