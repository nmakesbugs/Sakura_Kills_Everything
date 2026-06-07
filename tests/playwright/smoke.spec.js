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

  test('frames the product as adventures', async ({ page }) => {
    await page.goto(HOME);
    await expect(page.getByText(/Choose Sakura’s Next Adventure/i)).toBeVisible();
  });

  test('The Bird Incident is the playable flagship', async ({ page }) => {
    await page.goto(HOME);
    const bird = page.getByRole('link', { name: /The Bird Incident/i });
    await expect(bird).toBeVisible();
    await expect(bird).toContainText(/Playable/i);
    await expect(bird).toHaveAttribute('href', /adventures\/bird-incident\/index\.html/);
  });

  test('coming-soon adventures are teased', async ({ page }) => {
    await page.goto(HOME);
    await expect(page.getByText(/Squirrel Surveillance/i)).toBeVisible();
    await expect(page.getByText(/Vorg Watch/i)).toBeVisible();
  });

  test('Duck Hunt is demoted to a bonus Practice Yard (not the flagship)', async ({ page }) => {
    await page.goto(HOME);
    const practice = page.getByRole('link', { name: /Practice Yard/i });
    await expect(practice).toBeVisible();
    await expect(practice).toContainText(/Bonus/i);
    await expect(practice).toHaveAttribute('href', /modes\/duck-hunt\/index\.html/);
  });

  test('Free Patrol and Permanent Record remain accessible', async ({ page }) => {
    await page.goto(HOME);
    await expect(page.getByRole('link', { name: /Free Patrol/i })).toContainText(/Prototype/i);
    const record = page.getByRole('link', { name: /Permanent Record/i });
    await expect(record).toContainText(/Live/i);
    await expect(record).toHaveAttribute('href', /modes\/canon\/index\.html/);
  });

  test('Stage 0.6 build line is shown', async ({ page }) => {
    await page.goto(HOME);
    await expect(page.locator('.build-line')).toContainText(/Stage 0\.6/i);
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
