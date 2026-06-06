const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests/playwright',
  timeout: 30000,
  retries: 0,
  reporter: [['list'], ['json', { outputFile: 'tests/playwright/results.json' }]],
  use: {
    headless: true,
    launchOptions: { args: ['--allow-file-access-from-files'] },
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
});
