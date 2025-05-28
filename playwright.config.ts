import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  testMatch: /registration_merchant\.test\.ts$/,
  timeout: 60000,
  expect: { timeout: 10000 },
  fullyParallel: true,
  workers: 2,
  use: {
    headless: true,
    ignoreHTTPSErrors: true,
    trace: 'on-first-retry',
    video: {
      mode: 'on', // Record videos
      size: { width: 1280, height: 720 }, // Match the viewport size
    },
    screenshot: 'on', // Capture screenshots
    viewport: { width: 1280, height: 720 },
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36',
    extraHTTPHeaders: {
      'Accept-Language': 'en-US,en;q=0.9',
      'DNT': '1',
    },
  },
  reporter: [
 //   ['html', { outputFolder: 'playwright-report', open: 'never' }], // Playwright HTML report
    ['allure-playwright'], // Enable Allure reporting
  ],
});
