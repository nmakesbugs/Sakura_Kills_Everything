const { test, expect } = require('@playwright/test');
const path = require('path');

const EP = `file://${path.resolve(__dirname, '../../episodes/squirrel-surveillance/index.html')}`;
const CHOICES = ['surveillance', 'charge', 'pretend'];

test.describe('Episode 2 — Squirrel Surveillance', () => {

  test('loads and shows the title + episode label', async ({ page }) => {
    await page.goto(EP);
    await expect(page).toHaveTitle(/Squirrel Surveillance/);
    await expect(page.locator('.hud-title')).toContainText(/Sakura Kills Everything/i);
    await expect(page.locator('.hud-ver')).toContainText(/Episode 2/i);
    await expect(page.locator('#panel')).toContainText(/Squirrel Surveillance/i);
  });

  test('plays through one path by clicking to the official report', async ({ page }) => {
    await page.goto(EP);
    const click = async (txt) => { await page.locator('.actions .btn', { hasText: txt }).first().click(); await page.waitForTimeout(60); };
    await click('Begin the watch');         // intro -> squirrel
    await click('Open a case file');        // squirrel -> tanisha
    await click('Continue');                // tanisha -> briefing
    await click('Choose a response');       // briefing -> choice
    await page.locator('.choice', { hasText: 'Conduct surveillance' }).click();
    await page.waitForTimeout(60);
    await click('Proceed');                 // approach -> action
    await page.locator('#btn-act').click();
    await page.waitForTimeout(120);
    await click('Continue');                // complication -> evidence
    await click('File the report');         // evidence -> reaction
    await click('See the official record'); // reaction -> report
    await expect(page.locator('.report')).toBeVisible();
    await expect(page.locator('.report')).toContainText(/Official Interpretation/i);
    await expect(page.locator('.report')).toContainText(/Likely Reality/i);
    await expect(page.locator('.report .r-witness')).toContainText(/Tanisha/i);
    await expect(page.locator('.report .r-status')).toContainText(/Squirrel Status/i);
  });

  test('each of the three approaches produces a distinct report', async ({ page }) => {
    await page.goto(EP);
    const reportFor = (id) => page.evaluate((c) => {
      window.__tc.reachReport(c);
      const r = window.__tc.getReport();
      return { stamp: r.stamp, official: r.official, likely: r.likely, witness: r.witness, status: r.status };
    }, id);

    const results = {};
    for (const id of CHOICES) results[id] = await reportFor(id);

    for (const id of CHOICES) {
      const r = results[id];
      expect(r.official && r.official.length).toBeGreaterThan(0);
      expect(r.likely && r.likely.length).toBeGreaterThan(0);
      expect(r.witness && /Tanisha/i.test(r.witness)).toBeTruthy();
    }
    // distinct outcome stamps per choice
    expect(new Set(CHOICES.map(id => results[id].stamp)).size).toBe(3);
  });

  test('EVERY path confirms the squirrel remains uncaught (canon law)', async ({ page }) => {
    await page.goto(EP);
    for (const id of CHOICES) {
      const status = await page.evaluate((c) => {
        window.__tc.reachReport(c);
        return window.__tc.getReport().status;
      }, id);
      expect(status).toMatch(/uncaught|at large/i);
      // sanity: never reports a bare "caught" (only ever "uncaught")
      expect(/\bcaught\b/i.test(status.replace(/uncaught/ig, ''))).toBe(false);
    }
  });

  test('the report DOM shows official, likely, witness, stamp, and squirrel status', async ({ page }) => {
    await page.goto(EP);
    await page.evaluate(() => window.__tc.reachReport('charge'));
    await expect(page.locator('.report .r-official')).toContainText(/Sakura/i);
    await expect(page.locator('.report .r-reality')).toBeVisible();
    await expect(page.locator('.report .r-witness')).toContainText(/Tanisha/i);
    await expect(page.locator('.report .stamp')).toBeVisible();
    await expect(page.locator('.report .r-status .r-stat-val')).toContainText(/uncaught|at large/i);
  });

  test('Play Again resets to the opening', async ({ page }) => {
    await page.goto(EP);
    await page.evaluate(() => window.__tc.reachReport('pretend'));
    await expect(page.locator('.report')).toBeVisible();
    await page.evaluate(() => window.__tc.again());
    expect(await page.evaluate(() => window.__tc.state.beat)).toBe('intro');
    await expect(page.locator('#panel')).toContainText(/monitoring the fence line/i);
  });

  test('no console errors across a full playthrough', async ({ page }) => {
    const errors = [];
    page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
    page.on('pageerror', e => errors.push(e.message));
    await page.goto(EP);
    await page.evaluate(() => { window.__tc.reachReport('charge'); window.__tc.again(); });
    await page.waitForTimeout(200);
    expect(errors).toEqual([]);
  });

});
