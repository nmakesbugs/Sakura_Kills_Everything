const { test, expect } = require('@playwright/test');
const path = require('path');

const EP = `file://${path.resolve(__dirname, '../../episodes/vorg-watch/index.html')}`;
const THEORIES = ['vorg', 'squirrel', 'wind', 'unknown'];

test.describe('Episode 4 — Vorg Watch', () => {

  test('loads and shows the title + episode label', async ({ page }) => {
    await page.goto(EP);
    await expect(page).toHaveTitle(/Vorg Watch/);
    await expect(page.locator('.hud-ver')).toContainText(/Episode 4/i);
    await expect(page.locator('#panel')).toContainText(/Vorg Watch/i);
  });

  test('the evidence board appears with clue cards and a concern meter', async ({ page }) => {
    await page.goto(EP);
    const cont = async () => { await page.locator('.actions .btn').first().click(); await page.waitForTimeout(60); };
    await cont(); // intro -> anomaly
    await cont(); // anomaly -> tanisha
    await cont(); // tanisha -> case
    await expect(page.locator('.concern')).toBeVisible();
    await cont(); // Begin investigation -> board
    await expect(page.locator('.clue-grid')).toBeVisible();
    await expect(page.locator('.clue-card')).toHaveCount(5);
    await expect(page.locator('.concern .c-val')).toContainText(/Calm/i);
  });

  test('classifying 3 clues raises concern and reaches a report', async ({ page }) => {
    await page.goto(EP);
    const cont = async () => { await page.locator('.actions .btn').first().click(); await page.waitForTimeout(60); };
    await cont(); await cont(); await cont(); await cont(); // -> board

    const classifyFirstAvailable = async () => {
      await page.locator('.clue-card:not(.done):not([disabled])').first().click();
      await page.waitForTimeout(60);
      await page.locator('.classify .choice').first().click();
      await page.waitForTimeout(60);
    };
    await classifyFirstAvailable();                          // clue 1 -> board
    await classifyFirstAvailable();                          // clue 2 -> complication
    await page.locator('.actions .btn').first().click();     // dismiss complication -> board
    await page.waitForTimeout(60);
    await classifyFirstAvailable();                          // clue 3 -> board

    // concern should have risen above Calm
    await expect(page.locator('.concern .c-val')).not.toContainText(/^Calm$/i);

    await page.locator('.actions .btn', { hasText: 'Form a theory' }).first().click();
    await page.waitForTimeout(60);
    await page.locator('.theory .choice').first().click();   // pick first theory
    await page.waitForTimeout(60);
    await page.locator('.actions .btn', { hasText: 'witness review' }).first().click();
    await page.waitForTimeout(60);
    await page.locator('.actions .btn', { hasText: 'official record' }).first().click();
    await page.waitForTimeout(60);

    await expect(page.locator('.report')).toBeVisible();
    await expect(page.locator('.report')).toContainText(/Official Interpretation/i);
    await expect(page.locator('.report')).toContainText(/Likely Reality/i);
    await expect(page.locator('.report .r-witness')).toContainText(/Tanisha/i);
    await expect(page.locator('.report .r-status .r-stat-lab')).toContainText(/Vorg Status/i);
  });

  test('all four theory outcomes are reachable and distinct (via seam)', async ({ page }) => {
    await page.goto(EP);
    const reportFor = (t) => page.evaluate((th) => {
      window.__tc.reachReport(th);
      const r = window.__tc.getReport();
      return { stamp: r.stamp, official: r.official, likely: r.likely, witness: r.witness, status: r.status, sub: r.stampSub };
    }, t);

    const results = {};
    for (const t of THEORIES) results[t] = await reportFor(t);

    for (const t of THEORIES) {
      const r = results[t];
      expect(r.official.length).toBeGreaterThan(0);
      expect(r.likely.length).toBeGreaterThan(0);
      expect(/Tanisha/i.test(r.witness)).toBeTruthy();
      expect(/Concern:/i.test(r.sub)).toBeTruthy();
    }
    expect(new Set(THEORIES.map(t => results[t].stamp)).size).toBe(4);
  });

  test('the Vorg is NEVER confirmed (canon law)', async ({ page }) => {
    await page.goto(EP);
    for (const t of THEORIES) {
      const status = await page.evaluate((th) => {
        window.__tc.reachReport(th);
        return window.__tc.getReport().status;
      }, t);
      expect(status).toMatch(/unconfirmed|not confirmed/i);
      // never a bare "confirmed" (only ever "unconfirmed"/"not confirmed")
      expect(/\bconfirmed\b/i.test(status.replace(/unconfirmed|not confirmed/ig, ''))).toBe(false);
    }
  });

  test('Play Again resets to the opening', async ({ page }) => {
    await page.goto(EP);
    await page.evaluate(() => window.__tc.reachReport('vorg'));
    await expect(page.locator('.report')).toBeVisible();
    await page.evaluate(() => window.__tc.again());
    expect(await page.evaluate(() => window.__tc.state.beat)).toBe('intro');
    await expect(page.locator('#panel')).toContainText(/watching the far corner/i);
  });

  test('no console errors across a full playthrough', async ({ page }) => {
    const errors = [];
    page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
    page.on('pageerror', e => errors.push(e.message));
    await page.goto(EP);
    await page.evaluate(() => { window.__tc.reachReport('unknown'); window.__tc.again(); });
    await page.waitForTimeout(200);
    expect(errors).toEqual([]);
  });

});
