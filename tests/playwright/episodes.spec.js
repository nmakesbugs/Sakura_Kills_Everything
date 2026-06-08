const { test, expect } = require('@playwright/test');
const path = require('path');

const INDEX = `file://${path.resolve(__dirname, '../../episodes/index.html')}`;
const ROOT = `file://${path.resolve(__dirname, '../../index.html')}`;

test.describe('Episode index — the product face', () => {

  test('loads with the Incident Files title', async ({ page }) => {
    await page.goto(INDEX);
    await expect(page).toHaveTitle(/Incident Files/i);
    await expect(page.getByRole('heading', { level: 1 })).toContainText(/Incident Files/i);
  });

  test('The Bird Incident is listed and playable', async ({ page }) => {
    await page.goto(INDEX);
    const ep = page.locator('.episode', { hasText: 'The Bird Incident' });
    await expect(ep).toBeVisible();
    await expect(ep).toContainText(/Playable/i);
    await expect(ep).toHaveAttribute('href', /bird-incident\/index\.html/);
  });

  test('Squirrel Surveillance is listed and playable', async ({ page }) => {
    await page.goto(INDEX);
    const ep = page.locator('.episode', { hasText: 'Squirrel Surveillance' });
    await expect(ep).toBeVisible();
    await expect(ep).toContainText(/Playable/i);
    await expect(ep).toHaveAttribute('href', /squirrel-surveillance\/index\.html/);
  });

  test('future episodes are shown as Coming Soon', async ({ page }) => {
    await page.goto(INDEX);
    await expect(page.locator('.episode', { hasText: 'Rabbit at the Garden Frontier' })).toContainText(/Coming Soon/i);
    await expect(page.locator('.episode', { hasText: 'Vorg Watch' })).toContainText(/Coming Soon/i);
  });

  test('uses no "mode" language for primary navigation', async ({ page }) => {
    await page.goto(INDEX);
    const nav = await page.locator('.episode-list').innerText();
    expect(/duck hunt|patrol|chaos mode|rpg hunt/i.test(nav)).toBe(false);
  });

  test('links to the legacy build as reference only', async ({ page }) => {
    await page.goto(INDEX);
    await expect(page.locator('.legacy-line a')).toHaveAttribute('href', /legacy\/index\.html/);
  });

  test('root index routes to the episodes, not the mode selector', async ({ page }) => {
    await page.goto(ROOT);
    await expect(page).toHaveTitle(/Sakura Kills Everything/);
    await expect(page.locator('.episode', { hasText: 'Open the Incident Files' })).toHaveAttribute('href', /episodes\/index\.html/);
    await expect(page.locator('.ep-name', { hasText: /^The Bird Incident$/ })).toBeVisible();
    await expect(page.locator('.ep-name', { hasText: /^Squirrel Surveillance$/ })).toBeVisible();
  });

  test('no console errors on the index or root', async ({ page }) => {
    const errors = [];
    page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
    page.on('pageerror', e => errors.push(e.message));
    await page.goto(INDEX);
    await page.goto(ROOT);
    await page.waitForTimeout(200);
    expect(errors).toEqual([]);
  });

});
