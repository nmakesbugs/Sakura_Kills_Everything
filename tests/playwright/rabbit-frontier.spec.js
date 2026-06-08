const { test, expect } = require('@playwright/test');
const path = require('path');

const EP = `file://${path.resolve(__dirname, '../../episodes/rabbit-frontier/index.html')}`;
const FAMILIES = ['intercept', 'overcommit', 'escape', 'leaf'];

test.describe('Episode 3 — Rabbit at the Garden Frontier', () => {

  test('loads and shows the title + episode label', async ({ page }) => {
    await page.goto(EP);
    await expect(page).toHaveTitle(/Garden Frontier/);
    await expect(page.locator('.hud-ver')).toContainText(/Episode 3/i);
    await expect(page.locator('#panel')).toContainText(/Garden Frontier/i);
  });

  test('the chase map appears with all five nodes', async ({ page }) => {
    await page.goto(EP);
    const click = async (txt) => { await page.locator('.actions .btn', { hasText: txt }).first().click(); await page.waitForTimeout(60); };
    await click('Continue');   // intro -> rabbit
    await click('Continue');   // rabbit -> tanisha
    await click('Continue');   // tanisha -> map
    await expect(page.locator('.chase-map')).toBeVisible();
    await expect(page.locator('.node')).toHaveCount(5);
    await expect(page.locator('.tok.sakura')).toBeVisible();
    await expect(page.locator('.tok.rabbit')).toBeVisible();
  });

  test('a full route path plays through to an official report', async ({ page }) => {
    await page.goto(EP);
    const cont = async () => { await page.locator('.actions .btn').first().click(); await page.waitForTimeout(60); };
    const route = async () => { await page.locator('.route-grid .btn').first().click(); await page.waitForTimeout(60); };
    const click = async (txt) => { await page.locator('.actions .btn', { hasText: txt }).first().click(); await page.waitForTimeout(60); };
    await cont(); await cont(); await cont(); // intro -> rabbit -> tanisha -> map
    await cont();                              // Begin chase -> round 1
    await route();                             // choose route 1
    await cont();                              // result 1 -> round 2
    await route();                             // choose route 2
    await cont();                              // result 2 -> complication
    await click('mission');                    // complication: ignore the leaf -> round 3
    await route();                             // choose route 3
    await cont();                              // result 3 -> lunge
    await click('Commit');                     // resolve lunge -> evidence
    await click('File the report');            // evidence -> reaction
    await click('See the official record');    // reaction -> report
    await expect(page.locator('.report')).toBeVisible();
    await expect(page.locator('.report')).toContainText(/Official Interpretation/i);
    await expect(page.locator('.report')).toContainText(/Likely Reality/i);
    await expect(page.locator('.report .r-witness')).toContainText(/Tanisha/i);
    await expect(page.locator('.report .r-status')).toContainText(/Rabbit Status/i);
  });

  test('all four outcome families are reachable and distinct (via seam)', async ({ page }) => {
    await page.goto(EP);
    const reportFor = (f) => page.evaluate((fam) => {
      window.__tc.reachReport(fam);
      const r = window.__tc.getReport();
      return { stamp: r.stamp, official: r.official, likely: r.likely, witness: r.witness, status: r.status, route: r.stampSub };
    }, f);

    const results = {};
    for (const f of FAMILIES) results[f] = await reportFor(f);

    for (const f of FAMILIES) {
      const r = results[f];
      expect(r.official && r.official.length).toBeGreaterThan(0);
      expect(r.likely && r.likely.length).toBeGreaterThan(0);
      expect(/Tanisha/i.test(r.witness)).toBeTruthy();
      expect(r.status && r.status.length).toBeGreaterThan(0);
      expect(/Route:/i.test(r.route)).toBeTruthy();
    }
    expect(new Set(FAMILIES.map(f => results[f].stamp)).size).toBe(4);
  });

  test('report DOM shows official, likely, witness, stamp, and rabbit status', async ({ page }) => {
    await page.goto(EP);
    await page.evaluate(() => window.__tc.reachReport('escape'));
    await expect(page.locator('.report .r-official')).toContainText(/Sakura/i);
    await expect(page.locator('.report .r-reality')).toBeVisible();
    await expect(page.locator('.report .r-witness')).toContainText(/Tanisha/i);
    await expect(page.locator('.report .stamp')).toBeVisible();
    await expect(page.locator('.report .r-status .r-stat-lab')).toContainText(/Rabbit Status/i);
  });

  test('Play Again resets to the opening', async ({ page }) => {
    await page.goto(EP);
    await page.evaluate(() => window.__tc.reachReport('intercept'));
    await expect(page.locator('.report')).toBeVisible();
    await page.evaluate(() => window.__tc.again());
    expect(await page.evaluate(() => window.__tc.state.beat)).toBe('intro');
    await expect(page.locator('#panel')).toContainText(/routine inspection/i);
  });

  test('no console errors across a full playthrough', async ({ page }) => {
    const errors = [];
    page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
    page.on('pageerror', e => errors.push(e.message));
    await page.goto(EP);
    await page.evaluate(() => { window.__tc.reachReport('overcommit'); window.__tc.again(); });
    await page.waitForTimeout(200);
    expect(errors).toEqual([]);
  });

});
