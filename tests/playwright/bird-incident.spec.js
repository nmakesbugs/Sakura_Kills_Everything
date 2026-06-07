const { test, expect } = require('@playwright/test');
const path = require('path');

const BIRD = `file://${path.resolve(__dirname, '../../src/adventures/bird-incident/index.html')}`;
const CANON = `file://${path.resolve(__dirname, '../../src/modes/canon/index.html')}`;

test.describe('The Bird Incident (flagship adventure)', () => {

  test('loads with the briefing', async ({ page }) => {
    await page.goto(BIRD);
    await expect(page).toHaveTitle(/The Bird Incident/);
    await expect(page.getByRole('heading', { level: 1 })).toContainText('The Bird Incident');
    await expect(page.locator('#beat')).toContainText(/Incident Briefing/i);
    await expect(page.getByRole('link', { name: /Adventures/i })).toBeVisible();
  });

  test('observation and approach choices advance the episode', async ({ page }) => {
    await page.goto(BIRD);
    await page.evaluate(() => window.__birdIncident.start());
    await expect(page.locator('#beat')).toContainText(/Observation Post/i);
    await page.evaluate(() => window.__birdIncident.chooseObservation('patio'));
    await expect(page.locator('#beat')).toContainText(/The Approach/i);
    await page.evaluate(() => window.__birdIncident.chooseApproach('creep'));
    await expect(page.locator('#beat')).toContainText(/Complication/i);
  });

  test('the strike resolves and produces an official report with both layers', async ({ page }) => {
    await page.goto(BIRD);
    await page.evaluate(() => {
      window.__birdIncident.start();
      window.__birdIncident.chooseObservation('patio');
      window.__birdIncident.chooseApproach('charge');
      window.__birdIncident.strike('legendary');
      window.__birdIncident.toReport();
    });
    await expect(page.locator('#beat')).toContainText(/Official Interpretation/i);
    await expect(page.locator('#beat')).toContainText(/Likely Reality/i);
    const r = await page.evaluate(() => window.__birdIncident.getReport());
    expect(r.official && r.official.length).toBeGreaterThan(0);
    expect(r.likely && r.likely.length).toBeGreaterThan(0);
    expect(r.rank).toBe('Confirmed Aerial Engagement');
  });

  test('choices change the report (witness varies by observation post)', async ({ page }) => {
    await page.goto(BIRD);
    const witnessFor = (post) => page.evaluate((p) => {
      window.__birdIncident.restart();
      window.__birdIncident.start();
      window.__birdIncident.chooseObservation(p);
      window.__birdIncident.chooseApproach('creep');
      window.__birdIncident.strike('feather');
      window.__birdIncident.toReport();
      return window.__birdIncident.getReport().witness;
    }, post);
    expect(await witnessFor('patio')).toBe('Tanisha');
    expect(await witnessFor('window')).toBe('Nick');
    expect(await witnessFor('fence')).toBe('Cias');
  });

  test('canon holds: squirrel footnote never a catch; bird tiers are catchable/escape only', async ({ page }) => {
    await page.goto(BIRD);
    const r = await page.evaluate(() => {
      window.__birdIncident.start();
      window.__birdIncident.chooseObservation('fence'); // adds squirrel footnote
      window.__birdIncident.chooseApproach('creep');
      window.__birdIncident.strike('nearmiss');
      window.__birdIncident.toReport();
      return window.__birdIncident.getReport();
    });
    const sq = r.incidents.find(i => i.kind === 'squirrel');
    expect(sq.outcomeType).toBe('squirrelEscape');
    const bird = r.incidents.find(i => i.kind === 'bird');
    expect(['confirmedCatch', 'featherEvent', 'escape', 'falseAlarm']).toContain(bird.outcomeType);
  });

  test('the report files into the Permanent Record with sourceAdventure', async ({ page }) => {
    await page.goto(BIRD);
    await page.evaluate(() => window.SakuraStorage.clearIncidents());
    await page.evaluate(() => {
      window.__birdIncident.start();
      window.__birdIncident.chooseObservation('patio');
      window.__birdIncident.chooseApproach('wait');
      window.__birdIncident.strike('feather');
      window.__birdIncident.toReport();
      window.__birdIncident.file();
    });
    const saved = await page.evaluate(() => window.SakuraStorage.loadIncidents());
    expect(saved.length).toBeGreaterThan(0);
    expect(saved[0].sourceAdventure).toBe('bird-incident');

    // And it appears under the Adventures filter in the Permanent Record.
    await page.goto(CANON);
    await page.locator('#record-filters .chip-filter[data-filter="adventures"]').click();
    await expect(page.locator('#saved-incidents .incident-row').first()).toBeVisible();
  });

  test('no console errors across a full playthrough', async ({ page }) => {
    const errors = [];
    page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
    page.on('pageerror', e => errors.push(e.message));
    await page.goto(BIRD);
    await page.evaluate(() => {
      window.__birdIncident.start();
      window.__birdIncident.chooseObservation('window');
      window.__birdIncident.chooseApproach('bark');
      window.__birdIncident.strike('confusion');
      window.__birdIncident.toReport();
      window.__birdIncident.file();
    });
    await page.waitForTimeout(300);
    expect(errors).toEqual([]);
  });

});
