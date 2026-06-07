const { test, expect } = require('@playwright/test');
const path = require('path');

const CANON = `file://${path.resolve(__dirname, '../../src/modes/canon/index.html')}`;

test.describe('Canon Archive portal', () => {

  test('loads with title and back link', async ({ page }) => {
    await page.goto(CANON);
    await expect(page).toHaveTitle(/Sakura Canon/);
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Sakura Canon', { ignoreCase: true });
    await expect(page.getByRole('link', { name: /Back to hunting grounds/i })).toBeVisible();
  });

  test('shows archive department sections', async ({ page }) => {
    await page.goto(CANON);
    await expect(page.getByText(/Sakura Dossier/i)).toBeVisible();
    await expect(page.getByText(/Incident Archive/i)).toBeVisible();
    await expect(page.getByText(/Creature Catalog/i)).toBeVisible();
    await expect(page.getByText(/Organizations/i)).toBeVisible();
  });

  test('mentions the Vorg (still unconfirmed)', async ({ page }) => {
    await page.goto(CANON);
    await expect(page.locator('body')).toContainText(/Vorg/i);
  });

  test('renders incident cards with the dual layer', async ({ page }) => {
    await page.goto(CANON);
    const cards = page.locator('#archive-incidents .incident-card');
    await expect(cards.first()).toBeVisible();
    expect(await cards.count()).toBeGreaterThan(0);
    await expect(page.locator('#archive-incidents')).toContainText(/Official interpretation/i);
    await expect(page.locator('#archive-incidents')).toContainText(/Likely reality/i);
  });

  test('Permanent Record shows the empty state when nothing is filed', async ({ page }) => {
    await page.goto(CANON);
    await page.evaluate(() => window.SakuraStorage.clearIncidents());
    await page.reload();
    await expect(page.locator('#saved-empty')).toBeVisible();
    await expect(page.locator('#saved-empty')).toContainText(/paperwork has failed Sakura/i);
    await expect(page.locator('#saved-incidents .incident-card')).toHaveCount(0);
  });

  test('filed incidents appear in the Permanent Record with stats', async ({ page }) => {
    await page.goto(CANON);
    await page.evaluate(() => {
      window.SakuraStorage.clearIncidents();
      window.SakuraStorage.saveIncidents([
        { id: 'a', title: 'Feather Event', outcomeType: 'featherEvent', kind: 'bird', officialInterpretation: 'Air control broken.', likelyReality: 'A bird left.', zoneName: 'The Open Field' },
        { id: 'b', title: 'Squirrel Escaped', outcomeType: 'squirrelEscape', kind: 'squirrel', officialInterpretation: 'Secured.', likelyReality: 'It reached the fence.', zoneName: 'The Great Fence Line' }
      ], { sourceMode: 'duck-hunt' });
    });
    await page.reload();
    await expect(page.locator('#saved-empty')).toBeHidden();
    expect(await page.locator('#saved-incidents .incident-card').count()).toBe(2);
    await expect(page.locator('#archive-stats')).toContainText(/Squirrel capture rate: 0%/i);
    await expect(page.locator('#archive-stats')).toContainText(/Reports filed/i);
  });

  test('Purge Field Reports clears the record', async ({ page }) => {
    page.on('dialog', d => d.accept());
    await page.goto(CANON);
    await page.evaluate(() => {
      window.SakuraStorage.clearIncidents();
      window.SakuraStorage.saveIncidents([
        { id: 'a', title: 'X', outcomeType: 'escape', kind: 'rabbit', officialInterpretation: 'o', likelyReality: 'r', zoneName: 'The Garden Frontier' }
      ], { sourceMode: 'patrol' });
    });
    await page.reload();
    await expect(page.locator('#saved-incidents .incident-card')).toHaveCount(1);
    await page.locator('#btn-clear').click();
    await expect(page.locator('#saved-empty')).toBeVisible();
    expect(await page.evaluate(() => window.SakuraStorage.loadIncidents().length)).toBe(0);
  });

  test('no console errors on load', async ({ page }) => {
    const errors = [];
    page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
    page.on('pageerror', e => errors.push(e.message));
    await page.goto(CANON);
    await page.waitForTimeout(400);
    expect(errors).toEqual([]);
  });

});
