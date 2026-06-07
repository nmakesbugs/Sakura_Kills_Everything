const { test, expect } = require('@playwright/test');
const path = require('path');

// Any page that loads storage.js works; the Duck Hunt page does.
const PAGE = `file://${path.resolve(__dirname, '../../src/modes/duck-hunt/index.html')}`;

function sampleIncidents() {
  return [
    { id: 'a', title: 'Feather Event', outcomeType: 'featherEvent', kind: 'bird', officialInterpretation: 'Air control broken.', likelyReality: 'A bird flew away.', zoneName: 'The Open Field' },
    { id: 'b', title: 'Squirrel Escaped', outcomeType: 'squirrelEscape', kind: 'squirrel', officialInterpretation: 'Sector secured.', likelyReality: 'The squirrel reached the fence.', zoneName: 'The Great Fence Line' },
    { id: 'c', title: 'Anomaly', outcomeType: 'vorgNonConfirmation', kind: 'vorg', canonStatus: 'unconfirmed', officialInterpretation: 'Frontier held.', likelyReality: 'Something may have been there.', zoneName: 'The Unknown Regions' }
  ];
}

test.describe('Persistent incident memory (SakuraStorage)', () => {

  test('SakuraStorage exists with the full API', async ({ page }) => {
    await page.goto(PAGE);
    const ok = await page.evaluate(() => {
      const S = window.SakuraStorage;
      return !!(S && typeof S.saveIncidents === 'function' && typeof S.loadIncidents === 'function'
        && typeof S.clearIncidents === 'function' && typeof S.getStats === 'function');
    });
    expect(ok).toBe(true);
  });

  test('save / load / clear round-trips', async ({ page }) => {
    await page.goto(PAGE);
    const result = await page.evaluate((incs) => {
      window.SakuraStorage.clearIncidents();
      window.SakuraStorage.saveIncidents(incs, { sourceMode: 'duck-hunt', runTitle: 'Test Run' });
      const loaded = window.SakuraStorage.loadIncidents();
      const afterClear = (window.SakuraStorage.clearIncidents(), window.SakuraStorage.loadIncidents().length);
      return { count: loaded.length, sourceMode: loaded[0].sourceMode, hasSavedAt: !!loaded[0].savedAt, afterClear };
    }, sampleIncidents());
    expect(result.count).toBe(3);
    expect(result.sourceMode).toBe('duck-hunt');
    expect(result.hasSavedAt).toBe(true);
    expect(result.afterClear).toBe(0);
  });

  test('the record persists across a page reload', async ({ page }) => {
    await page.goto(PAGE);
    await page.evaluate((incs) => { window.SakuraStorage.clearIncidents(); window.SakuraStorage.saveIncidents(incs, { sourceMode: 'duck-hunt' }); }, sampleIncidents());
    await page.reload();
    const count = await page.evaluate(() => window.SakuraStorage.loadIncidents().length);
    expect(count).toBe(3);
  });

  test('newest first and capped', async ({ page }) => {
    await page.goto(PAGE);
    const res = await page.evaluate(() => {
      window.SakuraStorage.clearIncidents();
      // first batch
      window.SakuraStorage.saveIncidents([{ id: 'old', title: 'Old', outcomeType: 'escape', kind: 'rabbit', officialInterpretation: 'o', likelyReality: 'r' }], { sourceMode: 'duck-hunt' });
      // second batch (should land on top)
      window.SakuraStorage.saveIncidents([{ id: 'new', title: 'New', outcomeType: 'featherEvent', kind: 'bird', officialInterpretation: 'o', likelyReality: 'r' }], { sourceMode: 'patrol' });
      const top = window.SakuraStorage.loadIncidents()[0].id;
      // cap: push way past MAX
      const big = [];
      for (let i = 0; i < window.SakuraStorage.MAX + 50; i++) big.push({ id: 'x' + i, title: 't', outcomeType: 'escape', kind: 'rabbit', officialInterpretation: 'o', likelyReality: 'r' });
      window.SakuraStorage.saveIncidents(big, { sourceMode: 'duck-hunt' });
      return { top, capped: window.SakuraStorage.loadIncidents().length, max: window.SakuraStorage.MAX };
    });
    expect(res.top).toBe('new');
    expect(res.capped).toBe(res.max);
  });

  test('stats compute, squirrel capture rate stays 0%, official + likely preserved', async ({ page }) => {
    await page.goto(PAGE);
    const stats = await page.evaluate((incs) => {
      window.SakuraStorage.clearIncidents();
      window.SakuraStorage.saveIncidents(incs, { sourceMode: 'duck-hunt' });
      const loaded = window.SakuraStorage.loadIncidents();
      const preserved = loaded.every(i => i.officialInterpretation && i.likelyReality);
      const s = window.SakuraStorage.getStats();
      return { s, preserved };
    }, sampleIncidents());
    expect(stats.s.total).toBe(3);
    expect(stats.s.birdsNeutralized).toBe(1);
    expect(stats.s.squirrelEscapes).toBe(1);
    expect(stats.s.vorgNonConfirmations).toBe(1);
    expect(stats.s.squirrelCaptureRate).toBe('0%');
    expect(stats.preserved).toBe(true);
  });

});
