const { test, expect } = require('@playwright/test');
const path = require('path');

const DUCK_HUNT = `file://${path.resolve(__dirname, '../../src/modes/duck-hunt/index.html')}`;

test.describe('Duck Hunt', () => {

  test('loads with title, back link, and canvas', async ({ page }) => {
    await page.goto(DUCK_HUNT);
    await expect(page).toHaveTitle(/Duck Hunt/);
    await expect(page.getByRole('heading', { level: 1 }))
      .toContainText('Duck Hunt', { ignoreCase: true });
    await expect(page.getByRole('link', { name: /Back to hunting grounds/i })).toBeVisible();
    await expect(page.locator('canvas#yard')).toBeVisible();
  });

  test('engine helpers and test seam are exposed', async ({ page }) => {
    await page.goto(DUCK_HUNT);
    const ok = await page.evaluate(() => {
      const E = window.SakuraEngine;
      const D = window.__duckHunt;
      return !!(E
        && typeof E.fitCanvas === 'function'
        && typeof E.loop === 'function'
        && typeof E.pointerPos === 'function'
        && D
        && typeof D.spawn === 'function'
        && D.state);
    });
    expect(ok).toBe(true);
  });

  test('spawn() creates a target deterministically', async ({ page }) => {
    await page.goto(DUCK_HUNT);
    const result = await page.evaluate(() => {
      const t = window.__duckHunt.spawn('squirrel');
      return {
        type: t.type,
        hasTarget: !!window.__duckHunt.state.target,
        catchable: t.def.catchable
      };
    });
    expect(result.type).toBe('squirrel');
    expect(result.hasTarget).toBe(true);
    expect(result.catchable).toBe(false);
  });

  test('canon holds: bird is catchable, squirrel is not', async ({ page }) => {
    await page.goto(DUCK_HUNT);
    const r = await page.evaluate(() => ({
      squirrel: window.__duckHunt.TARGETS.squirrel.catchable,
      bird: window.__duckHunt.TARGETS.bird.catchable
    }));
    expect(r.squirrel).toBe(false);
    expect(r.bird).toBe(true);
  });

  test('tapping the yard registers an attempt without errors', async ({ page }) => {
    const errors = [];
    page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()); });
    page.on('pageerror', err => errors.push(err.message));

    await page.goto(DUCK_HUNT);
    await page.evaluate(() => window.__duckHunt.spawn('squirrel'));
    const before = await page.evaluate(() => window.__duckHunt.state.attempts);
    await page.locator('#stage').click({ position: { x: 20, y: 20 } });
    const after = await page.evaluate(() => window.__duckHunt.state.attempts);

    expect(after).toBe(before + 1);
    expect(errors).toEqual([]);
  });

  test('no console errors on load', async ({ page }) => {
    const errors = [];
    page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()); });
    page.on('pageerror', err => errors.push(err.message));
    await page.goto(DUCK_HUNT);
    await page.waitForTimeout(500);
    expect(errors).toEqual([]);
  });

});
