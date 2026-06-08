const { test, expect } = require('@playwright/test');
const path = require('path');

const EP = `file://${path.resolve(__dirname, '../../episodes/for-tanisha/index.html')}`;

test.describe('Closing — For Tanisha', () => {

  test('loads and shows the dedication', async ({ page }) => {
    await page.goto(EP);
    await expect(page).toHaveTitle(/For Tanisha/);
    await expect(page.locator('.closing-title')).toContainText(/For Tanisha/i);
    await expect(page.locator('.hud-ver')).toContainText(/v1\.1T/i);
  });

  test('shows an official interpretation and likely reality', async ({ page }) => {
    await page.goto(EP);
    await expect(page.locator('.closing-report .r-official')).toContainText(/Official Interpretation/i);
    await expect(page.locator('.closing-report .r-reality')).toContainText(/Likely Reality/i);
    await expect(page.locator('.closing-report .r-reality p')).toContainText(/loves Sakura/i);
  });

  test('back to incident files link is present', async ({ page }) => {
    await page.goto(EP);
    await expect(page.locator('.actions a', { hasText: /Back to Incident Files/i })).toHaveAttribute('href', /index\.html/);
  });

  test('no console errors', async ({ page }) => {
    const errors = [];
    page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
    page.on('pageerror', e => errors.push(e.message));
    await page.goto(EP);
    await page.waitForTimeout(300);
    expect(errors).toEqual([]);
  });

});
