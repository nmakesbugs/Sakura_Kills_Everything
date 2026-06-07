const { test, expect } = require('@playwright/test');
const path = require('path');

const HOME = `file://${path.resolve(__dirname, '../../index.html')}`;

test.describe('Home screen', () => {

  test('loads without crashing', async ({ page }) => {
    await page.goto(HOME);
    await expect(page).toHaveTitle('Sakura Kills Everything');
  });

  test('title is visible', async ({ page }) => {
    await page.goto(HOME);
    const heading = page.getByRole('heading', { level: 1 });
    await expect(heading).toBeVisible();
    await expect(heading).toContainText('Sakura Kills Everything', { ignoreCase: true });
  });

  test('all five mode buttons are present', async ({ page }) => {
    await page.goto(HOME);
    await expect(page.getByRole('link', { name: /Duck Hunt/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /Patrol/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /RPG Hunt/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /Chaos Mode/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /Sakura Canon/i })).toBeVisible();
  });

  test('Duck Hunt is marked playable', async ({ page }) => {
    await page.goto(HOME);
    const duckHunt = page.getByRole('link', { name: /Duck Hunt/i });
    await expect(duckHunt).toContainText(/Playable/i);
  });

  test('future modes are visible and Canon Archive is accessible', async ({ page }) => {
    await page.goto(HOME);
    // Future modes still shown.
    await expect(page.getByRole('link', { name: /Patrol/i })).toContainText(/Future/i);
    // Canon links to the archive page.
    const canon = page.getByRole('link', { name: /Sakura Canon/i });
    await expect(canon).toHaveAttribute('href', /modes\/canon\/index\.html/);
  });

  test('no console errors on load', async ({ page }) => {
    const errors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') errors.push(msg.text());
    });
    page.on('pageerror', err => errors.push(err.message));
    await page.goto(HOME);
    // Allow a moment for any deferred errors
    await page.waitForTimeout(500);
    expect(errors).toEqual([]);
  });

});
