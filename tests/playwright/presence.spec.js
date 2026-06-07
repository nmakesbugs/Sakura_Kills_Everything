const { test, expect } = require('@playwright/test');
const path = require('path');

const DUCK_HUNT = `file://${path.resolve(__dirname, '../../src/modes/duck-hunt/index.html')}`;
const PATROL = `file://${path.resolve(__dirname, '../../src/modes/side-scroller/index.html')}`;

test.describe('SakuraPresence runtime visual policy', () => {

  test('SakuraPresence exists with the v0.1 API', async ({ page }) => {
    await page.goto(DUCK_HUNT);
    const ok = await page.evaluate(() => {
      const P = window.SakuraPresence;
      return !!(P && typeof P.portrait === 'function' && typeof P.token === 'function'
        && typeof P.outcomeFx === 'function' && typeof P.strike === 'function');
    });
    expect(ok).toBe(true);
  });

  test('Duck Hunt HUD shows a static Sakura portrait', async ({ page }) => {
    await page.goto(DUCK_HUNT);
    await expect(page.locator('#hud-avatar .sp-portrait img')).toHaveCount(1);
  });

  test('POLICY: no animated Sakura photo in the gameplay field', async ({ page }) => {
    await page.goto(DUCK_HUNT);
    // Start a run, spawn targets — the play field must never contain an <img>.
    await page.evaluate(() => { window.__duckHunt.startRun(); window.__duckHunt.spawn('bird'); window.__duckHunt.spawn('squirrel'); });
    await page.waitForTimeout(150);
    await expect(page.locator('#field img')).toHaveCount(0);
  });

  test('outcomeFx renders a symbolic strike/ring into a container', async ({ page }) => {
    await page.goto(DUCK_HUNT);
    const fx = await page.evaluate(() => {
      const box = document.getElementById('field');
      window.SakuraPresence.outcomeFx(box, 40, 40, 'confirmedCatch', true);
      return box.querySelectorAll('.sp-fx').length;
    });
    expect(fx).toBeGreaterThan(0);
  });

  test('Patrol report carries a static Sakura portrait badge', async ({ page }) => {
    await page.goto(PATROL);
    await expect(page.locator('#report-portrait .sp-portrait')).toHaveCount(1);
  });

  test('no console errors on the presence-enabled pages', async ({ page }) => {
    const errors = [];
    page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
    page.on('pageerror', e => errors.push(e.message));
    await page.goto(DUCK_HUNT);
    await page.waitForTimeout(300);
    await page.goto(PATROL);
    await page.waitForTimeout(300);
    expect(errors).toEqual([]);
  });

});
