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

  test('no console errors on load', async ({ page }) => {
    const errors = [];
    page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
    page.on('pageerror', e => errors.push(e.message));
    await page.goto(CANON);
    await page.waitForTimeout(400);
    expect(errors).toEqual([]);
  });

});
