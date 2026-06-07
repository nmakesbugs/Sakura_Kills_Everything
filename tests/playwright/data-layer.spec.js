const { test, expect } = require('@playwright/test');
const path = require('path');

// The Duck Hunt page loads the full data + engine layer.
const PAGE = `file://${path.resolve(__dirname, '../../src/modes/duck-hunt/index.html')}`;

test.describe('Canon data layer', () => {

  test('zones, creatures, and incidents data exist', async ({ page }) => {
    await page.goto(PAGE);
    const shape = await page.evaluate(() => ({
      zones: window.SakuraData.zones.length,
      creatures: window.SakuraData.creatures.length,
      incidents: window.SakuraData.incidents.length
    }));
    expect(shape.zones).toBeGreaterThanOrEqual(10);
    expect(shape.creatures).toBeGreaterThanOrEqual(15);
    expect(shape.incidents).toBeGreaterThanOrEqual(8);
  });

  test('canon law: the squirrel is not catchable', async ({ page }) => {
    await page.goto(PAGE);
    const sq = await page.evaluate(() => window.SakuraData.creatureById('the-squirrel'));
    expect(sq).not.toBeNull();
    expect(sq.catchable).toBe(false);
  });

  test('all squirrels are uncatchable', async ({ page }) => {
    await page.goto(PAGE);
    const allFalse = await page.evaluate(() =>
      window.SakuraData.creaturesByType('squirrel').every(c => c.catchable === false));
    expect(allFalse).toBe(true);
  });

  test('curated incidents carry both official interpretation and likely reality', async ({ page }) => {
    await page.goto(PAGE);
    const ok = await page.evaluate(() =>
      window.SakuraData.incidents.every(i =>
        typeof i.officialInterpretation === 'string' && i.officialInterpretation.length > 0 &&
        typeof i.likelyReality === 'string' && i.likelyReality.length > 0));
    expect(ok).toBe(true);
  });

  test('at least one vorg incident is unconfirmed', async ({ page }) => {
    await page.goto(PAGE);
    const hasUnconfirmedVorg = await page.evaluate(() =>
      window.SakuraData.incidents.some(i =>
        i.outcomeType === 'vorgNonConfirmation' && /unconfirmed/i.test(i.canonStatus)));
    expect(hasUnconfirmedVorg).toBe(true);
  });

  test('voice lines exist for the core categories', async ({ page }) => {
    await page.goto(PAGE);
    const ok = await page.evaluate(() => {
      const v = window.SakuraData.voiceLines;
      return ['birdCatch', 'squirrelEscape', 'vorgAlert', 'officialInterpretation', 'likelyReality']
        .every(c => Array.isArray(v[c]) && v[c].length > 0);
    });
    expect(ok).toBe(true);
  });

});
