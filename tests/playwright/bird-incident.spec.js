const { test, expect } = require('@playwright/test');
const path = require('path');

const EP = `file://${path.resolve(__dirname, '../../episodes/bird-incident/index.html')}`;

test.describe('Episode 1 — The Bird Incident', () => {

  test('loads and shows the title + episode label', async ({ page }) => {
    await page.goto(EP);
    await expect(page).toHaveTitle(/Bird Incident/);
    await expect(page.locator('.hud-title')).toContainText(/Sakura Kills Everything/i);
    await expect(page.locator('.hud-ver')).toContainText(/Episode 1/i);
    await expect(page.locator('#panel')).toContainText(/The Bird Incident/i);
  });

  test('plays through one path by clicking to the official report', async ({ page }) => {
    await page.goto(EP);
    const click = async (txt) => { await page.locator('.actions .btn', { hasText: txt }).first().click(); await page.waitForTimeout(60); };
    await click('Continue');               // portrait -> yard
    await click('Continue');               // yard -> bird
    await click('Log the violation');      // bird -> notices
    await click('Continue');               // notices -> tanisha
    await click('Continue');               // tanisha -> escalation
    await click('Decide');                 // escalation -> choice
    await page.locator('.choice', { hasText: 'Stalk with dignity' }).click();
    await page.waitForTimeout(60);
    await click('Move in');                // approach -> action
    await page.locator('#btn-strike').click();
    await page.waitForTimeout(120);
    await click('Continue');               // complication -> evidence
    await click('File the report');        // evidence -> reaction
    await click('See the official record');// reaction -> report
    await expect(page.locator('.report')).toBeVisible();
    await expect(page.locator('.report')).toContainText(/Official Interpretation/i);
    await expect(page.locator('.report')).toContainText(/Likely Reality/i);
    await expect(page.locator('.report .r-witness')).toContainText(/Tanisha/i);
  });

  test('each of the three approaches produces a distinct report', async ({ page }) => {
    await page.goto(EP);
    const reportFor = (id) => page.evaluate((c) => {
      window.__tc.reachReport(c);
      const r = window.__tc.getReport();
      return { stamp: r.stamp, official: r.official, likely: r.likely, witness: r.witness };
    }, id);

    const stalk = await reportFor('stalk');
    const launch = await reportFor('launch');
    const bark = await reportFor('bark');

    for (const r of [stalk, launch, bark]) {
      expect(r.official && r.official.length).toBeGreaterThan(0);
      expect(r.likely && r.likely.length).toBeGreaterThan(0);
      expect(r.witness && /Tanisha/i.test(r.witness)).toBeTruthy();
    }
    expect(new Set([stalk.stamp, launch.stamp, bark.stamp]).size).toBe(3);
  });

  test('the report DOM shows official, likely, and a Tanisha witness note', async ({ page }) => {
    await page.goto(EP);
    await page.evaluate(() => window.__tc.reachReport('launch'));
    await expect(page.locator('.report .r-official')).toContainText(/Sakura/i);
    await expect(page.locator('.report .r-reality')).toBeVisible();
    await expect(page.locator('.report .r-witness')).toContainText(/Tanisha/i);
    await expect(page.locator('.report .stamp')).toBeVisible();
  });

  test('Play Again resets to the opening', async ({ page }) => {
    await page.goto(EP);
    await page.evaluate(() => window.__tc.reachReport('bark'));
    await expect(page.locator('.report')).toBeVisible();
    await page.evaluate(() => window.__tc.again());
    expect(await page.evaluate(() => window.__tc.state.beat)).toBe('portrait');
    await expect(page.locator('#panel')).toContainText(/monitoring the yard/i);
  });

  test('no console errors across a full playthrough', async ({ page }) => {
    const errors = [];
    page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
    page.on('pageerror', e => errors.push(e.message));
    await page.goto(EP);
    await page.evaluate(() => { window.__tc.reachReport('stalk'); window.__tc.again(); });
    await page.waitForTimeout(200);
    expect(errors).toEqual([]);
  });

});
