const { test, expect } = require('@playwright/test');
const path = require('path');

const PATROL = `file://${path.resolve(__dirname, '../../src/modes/side-scroller/index.html')}`;

test.describe('Patrol prototype', () => {

  test('page loads with title, back link, and the backyard zone map', async ({ page }) => {
    await page.goto(PATROL);
    await expect(page).toHaveTitle(/Patrol/);
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Patrol', { ignoreCase: true });
    await expect(page.getByRole('link', { name: /Back to hunting grounds/i })).toBeVisible();
    await expect(page.getByText(/Select Patrol Sector/i)).toBeVisible();
    await expect(page.locator('#zone-grid .sector-tile').first()).toBeVisible();
    expect(await page.locator('#zone-grid .sector-tile').count()).toBeGreaterThanOrEqual(3);
  });

  test('zone map tiles show danger + filed counts, and selecting one starts a patrol there', async ({ page }) => {
    await page.goto(PATROL);
    // tiles carry danger + filed markers
    await expect(page.locator('#zone-grid .sector-tile .st-danger').first()).toBeVisible();
    await expect(page.locator('#zone-grid .sector-tile .st-filed').first()).toContainText(/Filed:/i);
    // pick the fence-line sector and confirm the HUD reflects it
    await page.locator('#zone-grid .sector-tile[data-zone="fence-line"]').click();
    await expect(page.locator('#panel-patrol')).toBeVisible();
    await expect(page.locator('#hud-zone')).toContainText(/Fence Line/i);
    expect(await page.evaluate(() => window.__patrol.state.zoneId)).toBe('fence-line');
  });

  test('a patrol can start and an encounter appears', async ({ page }) => {
    await page.goto(PATROL);
    await page.evaluate(() => window.__patrol.startPatrol('fence-line'));
    await expect(page.locator('#panel-patrol')).toBeVisible();
    await expect(page.locator('#encounter')).toBeVisible();
    const desc = await page.locator('#enc-desc').textContent();
    expect(desc && desc.trim().length).toBeGreaterThan(0);
    expect(await page.evaluate(() => window.__patrol.state.phase)).toBe('patrolling');
  });

  test('resolving an encounter produces an incident card', async ({ page }) => {
    await page.goto(PATROL);
    await page.evaluate(() => window.__patrol.startPatrol('garden-frontier'));
    await page.evaluate(() => window.__patrol.resolveEncounter('investigate'));
    await expect(page.locator('#resolution')).toBeVisible();
    await expect(page.locator('#resolution-card .incident-card')).toBeVisible();
    expect(await page.evaluate(() => window.__patrol.state.incidents.length)).toBe(1);
  });

  test('canon holds in Patrol: squirrel never caught, vorg never confirmed', async ({ page }) => {
    await page.goto(PATROL);
    const r = await page.evaluate(() => {
      const sq = [];
      for (let i = 0; i < 20; i++) sq.push(window.SakuraIncident.resolvePatrol('squirrel', 'pounce').outcomeType);
      const vorg = window.SakuraIncident.resolvePatrol('vorg', 'pounce').outcomeType;
      return { sq, vorg };
    });
    expect(r.sq.every(o => o === 'squirrelEscape')).toBe(true);
    expect(r.vorg).toBe('vorgNonConfirmation');
  });

  test('a patrol ends with an after-action report and can be filed', async ({ page }) => {
    await page.goto(PATROL);
    await page.evaluate(() => window.SakuraStorage.clearIncidents());
    await page.evaluate(() => {
      window.__patrol.startPatrol('unknown-regions');
      const n = window.__patrol.state.plan.length;
      for (let i = 0; i < n; i++) {
        window.__patrol.resolveEncounter('investigate');
        if (i < n - 1) window.__patrol.next();
      }
      window.__patrol.endPatrol();
    });
    await expect(page.locator('#panel-summary')).toBeVisible();
    await expect(page.locator('#panel-summary')).toContainText(/Official interpretation/i);
    await expect(page.locator('#panel-summary')).toContainText(/Likely reality/i);
    const before = await page.evaluate(() => window.SakuraStorage.loadIncidents().length);
    await page.locator('#btn-file').click();
    const after = await page.evaluate(() => window.SakuraStorage.loadIncidents().length);
    expect(after).toBeGreaterThan(before);
    await expect(page.locator('#file-confirm')).toBeVisible();
  });

  test('no console errors across a patrol', async ({ page }) => {
    const errors = [];
    page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
    page.on('pageerror', e => errors.push(e.message));
    await page.goto(PATROL);
    await page.evaluate(() => {
      window.__patrol.startPatrol('great-patio');
      const n = window.__patrol.state.plan.length;
      for (let i = 0; i < n; i++) { window.__patrol.resolveEncounter('pounce'); if (i < n - 1) window.__patrol.next(); }
      window.__patrol.endPatrol();
    });
    await page.waitForTimeout(200);
    expect(errors).toEqual([]);
  });

});
