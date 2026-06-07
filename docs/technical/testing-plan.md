# Testing Plan

---

## Testing Stack

**Playwright** — headless Chromium, `file://` protocol, no dev server.

```bash
npm install
npx playwright install     # first time only — downloads Chromium
npm test                   # = playwright test
npm run test:headed        # watch in a real browser
npm run test:report        # open the last HTML report
```

Config: `playwright.config.js` · Results: `tests/playwright/results.json` + console output.

---

## Build 1 — Smoke Tests

File: `tests/playwright/smoke.spec.js`

| Test | What It Checks |
|---|---|
| Home screen loads | Page opens, no crash, `<title>` set |
| Title visible | "SAKURA KILLS EVERYTHING" heading present in DOM |
| All buttons present | All five mode buttons visible |
| No console errors | Zero errors logged during page load |

---

## Stage 0.2 — Platform Coverage

Specs live in `tests/playwright/`:

**`smoke.spec.js` (Home)** — loads, title visible, all five modes present, Duck Hunt marked
playable, Canon accessible, no console errors.

**`duck-hunt.spec.js`** — page loads; engines + `window.__duckHunt` seam exist; a run can
start; targets spawn; a bird resolves to a catch (feather/confirmed); **a squirrel can never
be confirmed caught**; misses/escapes produce text; a run can end; the after-action summary
appears with both **official interpretation** and **likely reality**; no console errors.

**`canon.spec.js`** — archive loads; shows department sections; mentions the Vorg; renders
incident cards from the data layer; no console errors.

**`data-layer.spec.js`** — via page evaluation: creatures/zones/incidents data exist;
`the-squirrel.catchable === false`; curated incidents carry `officialInterpretation` and
`likelyReality`; at least one vorg incident is `unconfirmed`.

## Stage 0.3 — Persistence + Patrol Coverage

**`storage.spec.js`** — `window.SakuraStorage` exists; save/load/clear round-trips; the
permanent record persists across a page reload; cap and newest-first ordering hold; the
squirrel capture rate stays `0%`; filed incidents preserve official + likely.

**`duck-hunt.spec.js` (added)** — after a run, **File Official Report** saves the run's
incidents to `SakuraStorage` and the button shows a confirmation state.

**`canon.spec.js` (added)** — the Permanent Record empty-state shows when storage is empty;
after filing, saved cards appear and stats update; **Purge Field Reports** clears the record.

**`patrol.spec.js`** — page loads; a patrol can start from a sector; an encounter appears; the
player can resolve an encounter (incident card appears); a squirrel encounter never confirms a
catch; a vorg encounter only non-confirms; the patrol ends with an after-action report; the
patrol report can be filed; no console errors.

---

## Per-Build Testing Standard

Every build must:
1. Pass all prior smoke tests
2. Add at least one new test covering new functionality
3. Not introduce console errors on any existing screen

---

## Screenshot Capture

Screenshots are saved to `tests/screenshots/` (git-ignored). Nick keeps these as learning
artifacts. They are produced on failure and by QA helper scripts that capture the home screen,
a Duck Hunt run, the after-action report, and the Canon Archive. Generated screenshots are
referenced in the stage's final report.

---

## What Is Not Tested (Yet)

- Visual regression — no screenshot comparison in Build 1
- Performance — no Lighthouse integration yet
- Cross-browser — Chromium only until gameplay is built
- Offline behavior — not tested but should work (no network calls)
