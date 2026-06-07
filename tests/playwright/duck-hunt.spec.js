const { test, expect } = require('@playwright/test');
const path = require('path');

const DUCK_HUNT = `file://${path.resolve(__dirname, '../../src/modes/duck-hunt/index.html')}`;

test.describe('Duck Hunt — first playable', () => {

  test('page loads with title, back link, and field', async ({ page }) => {
    await page.goto(DUCK_HUNT);
    await expect(page).toHaveTitle(/Duck Hunt/);
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Duck Hunt', { ignoreCase: true });
    await expect(page.getByRole('link', { name: /Hunting grounds/i })).toBeVisible();
    await expect(page.locator('#field')).toBeVisible();
  });

  test('platform globals and test seam are present', async ({ page }) => {
    await page.goto(DUCK_HUNT);
    const ok = await page.evaluate(() => {
      return !!(window.SakuraData && window.SakuraIncident && window.SakuraVoice
        && window.SakuraRandom && window.SakuraUI
        && window.__duckHunt && typeof window.__duckHunt.startRun === 'function'
        && typeof window.__duckHunt.simulate === 'function');
    });
    expect(ok).toBe(true);
  });

  test('a run can start and targets spawn', async ({ page }) => {
    await page.goto(DUCK_HUNT);
    await page.evaluate(() => window.__duckHunt.startRun());
    const id = await page.evaluate(() => window.__duckHunt.spawn('bird'));
    expect(typeof id).toBe('string');
    await expect(page.locator('.target')).toHaveCount(1);
    const phase = await page.evaluate(() => window.__duckHunt.state.phase);
    expect(phase).toBe('playing');
  });

  test('a bird can be neutralized (feather event or confirmed catch)', async ({ page }) => {
    await page.goto(DUCK_HUNT);
    const outcome = await page.evaluate(() => window.__duckHunt.simulate('bird', true).outcomeType);
    expect(['featherEvent', 'confirmedCatch']).toContain(outcome);
  });

  test('a squirrel can NEVER be confirmed caught (canon)', async ({ page }) => {
    await page.goto(DUCK_HUNT);
    const results = await page.evaluate(() => {
      var outs = [];
      for (var i = 0; i < 40; i++) outs.push(window.__duckHunt.simulate('squirrel', true).outcomeType);
      return outs;
    });
    // Every squirrel resolution is an escape; none is any kind of catch.
    expect(results.every(o => o === 'squirrelEscape')).toBe(true);
    expect(results.some(o => o === 'confirmedCatch' || o === 'featherEvent' || o === 'suspectedCatch')).toBe(false);
  });

  test('vorg produces a non-confirmation, never a catch', async ({ page }) => {
    await page.goto(DUCK_HUNT);
    const outcome = await page.evaluate(() => window.__duckHunt.simulate('vorg', true).outcomeType);
    expect(outcome).toBe('vorgNonConfirmation');
  });

  test('an escape/miss produces narration text', async ({ page }) => {
    await page.goto(DUCK_HUNT);
    await page.evaluate(() => { window.__duckHunt.startRun(); window.__duckHunt.simulate('rabbit', false); });
    const msg = await page.locator('#status').textContent();
    expect(msg && msg.trim().length).toBeGreaterThan(0);
  });

  test('tapping a spawned target logs an incident without errors', async ({ page }) => {
    const errors = [];
    page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
    page.on('pageerror', e => errors.push(e.message));
    await page.goto(DUCK_HUNT);
    // Hide the start panel but do NOT start the run loop, so no auto-spawn
    // replaces the target mid-test and the field is tappable.
    await page.evaluate(() => { document.getElementById('panel-start').hidden = true; });
    await page.evaluate(() => window.__duckHunt.spawn('bird'));
    const before = await page.evaluate(() => window.__duckHunt.state.incidents.length);
    await page.locator('.target').first().click({ force: true });
    const after = await page.evaluate(() => window.__duckHunt.state.incidents.length);
    expect(after).toBeGreaterThan(before);
    expect(errors).toEqual([]);
  });

  test('a run ends with an after-action report (official + likely reality)', async ({ page }) => {
    await page.goto(DUCK_HUNT);
    await page.evaluate(() => {
      window.__duckHunt.startRun();
      // file a few incidents, then end the run
      window.__duckHunt.simulate('bird', true);
      window.__duckHunt.simulate('squirrel', true);
      window.__duckHunt.simulate('rabbit', true);
      window.__duckHunt.endRun();
    });
    await expect(page.locator('#panel-summary')).toBeVisible();
    const official = await page.locator('#summary-official').textContent();
    const reality = await page.locator('#summary-reality').textContent();
    expect(official && official.trim().length).toBeGreaterThan(0);
    expect(reality && reality.trim().length).toBeGreaterThan(0);
    // Incidents are collapsed by default (no paperwork wall); expand to view rows.
    await expect(page.locator('#summary-incidents')).toBeHidden();
    await page.locator('#btn-incidents').click();
    await expect(page.locator('#summary-incidents .incident-row').first()).toBeVisible();
  });

  test('the summary shows both an Official interpretation and a Likely reality label', async ({ page }) => {
    await page.goto(DUCK_HUNT);
    await page.evaluate(() => { window.__duckHunt.startRun(); window.__duckHunt.simulate('bird', true); window.__duckHunt.endRun(); });
    await expect(page.locator('#panel-summary')).toContainText(/Official interpretation/i);
    await expect(page.locator('#panel-summary')).toContainText(/Likely reality/i);
  });

  test('a finished run can be filed to the permanent record', async ({ page }) => {
    await page.goto(DUCK_HUNT);
    await page.evaluate(() => window.SakuraStorage.clearIncidents());
    await page.evaluate(() => {
      window.__duckHunt.startRun();
      window.__duckHunt.simulate('bird', true);
      window.__duckHunt.simulate('squirrel', true);
      window.__duckHunt.endRun();
    });
    const before = await page.evaluate(() => window.SakuraStorage.loadIncidents().length);
    await page.locator('#btn-file').click();
    const after = await page.evaluate(() => window.SakuraStorage.loadIncidents().length);
    expect(after).toBeGreaterThan(before);
    // Button enters a confirmation state, confirmation text shows.
    await expect(page.locator('#btn-file')).toContainText(/Filed/i);
    await expect(page.locator('#file-confirm')).toBeVisible();
    // Saved incidents are tagged with the source mode.
    const src = await page.evaluate(() => window.SakuraStorage.loadIncidents()[0].sourceMode);
    expect(src).toBe('duck-hunt');
  });

  test('no console errors across a full simulated run', async ({ page }) => {
    const errors = [];
    page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
    page.on('pageerror', e => errors.push(e.message));
    await page.goto(DUCK_HUNT);
    await page.evaluate(() => {
      window.__duckHunt.startRun();
      ['bird', 'squirrel', 'rabbit', 'falseAlarm', 'vorg'].forEach(k => window.__duckHunt.simulate(k, true));
      window.__duckHunt.endRun();
    });
    await page.waitForTimeout(300);
    expect(errors).toEqual([]);
  });

});
