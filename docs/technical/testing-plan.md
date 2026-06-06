# Testing Plan

---

## Testing Stack

**Playwright** — headless Chromium, `file://` protocol, no dev server.

Install: `npm install`  
Run: `npx playwright test`  
Config: `playwright.config.js`  
Results: `tests/playwright/results.json` + console output

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

## Build 2 — Duck Hunt Tests (Planned)

- Duck Hunt screen loads from home screen link
- Canvas element renders
- Tap interaction logs expected response
- Back navigation returns to home screen

---

## Per-Build Testing Standard

Every build must:
1. Pass all prior smoke tests
2. Add at least one new test covering new functionality
3. Not introduce console errors on any existing screen

---

## Screenshot Capture

Playwright saves screenshots to `tests/screenshots/` on test failure. This directory is not committed to version control but is useful for debugging.

---

## What Is Not Tested (Yet)

- Visual regression — no screenshot comparison in Build 1
- Performance — no Lighthouse integration yet
- Cross-browser — Chromium only until gameplay is built
- Offline behavior — not tested but should work (no network calls)
