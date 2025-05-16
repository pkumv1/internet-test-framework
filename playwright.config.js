/**
 * @type {import('@playwright/test').PlaywrightTestConfig}
 */
const config = {
  testDir: './test_scripts/playwright',
  timeout: 30000,
  expect: {
    timeout: 10000
  },
  reporter: [
    ['html', { outputFolder: './results/playwright/html-report' }],
    ['json', { outputFile: './results/playwright/test-results.json' }]
  ],
  use: {
    baseURL: 'http://the-internet.herokuapp.com',
    headless: true,
    viewport: { width: 1280, height: 720 },
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'on-first-retry'
  },
  projects: [
    {
      name: 'chromium',
      use: {
        browserName: 'chromium'
      }
    },
    {
      name: 'firefox',
      use: {
        browserName: 'firefox'
      }
    }
  ]
};

module.exports = config;