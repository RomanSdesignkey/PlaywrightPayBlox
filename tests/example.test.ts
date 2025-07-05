import { test, expect } from '@playwright/test';
import { allure } from 'allure-playwright';

test('Run a WebPageTest performance test with browser config', async ({
  page,
}, testInfo) => {
  try {
    allure.label('Component', 'WebPageTest');
    allure.description('This test automates performance testing using WebPageTest.');

    await test.step('Navigate to WebPageTest', async () => {
      await page.goto('https://www.webpagetest.org/', { waitUntil: 'domcontentloaded' });
      allure.attachment('Homepage Screenshot', await page.screenshot(), 'image/png');
    });

    await test.step('Enter URL to Test', async () => {
      const urlInput = page.locator('input[name="url"]');
      await urlInput.waitFor({ state: 'visible', timeout: 10000 });

      const testUrl = 'https://example.com';
      await urlInput.fill('');
      for (const char of testUrl) {
        await urlInput.type(char, { delay: 100 + Math.random() * 50 });
      }
    });

    await test.step('Select Test Location', async () => {
      const locationDropdown = page.locator('.simpleadvancedfields_contain').first();
      await locationDropdown.scrollIntoViewIfNeeded();
      await locationDropdown.waitFor({ state: 'visible', timeout: 10000 });
      await locationDropdown.click();
    });

    await page.waitForTimeout(1000);

    await test.step('Start the Test', async () => {
      const startTestButton = page.locator('.test_presets_easy_submit .start_test');
      await startTestButton.waitFor({ state: 'visible', timeout: 10000 });
      await startTestButton.click();
    });

    await test.step('Check for Errors', async () => {
      const errorBox = page.locator('.testerror');
      const isErrorVisible = await errorBox
        .isVisible({ timeout: 5000 })
        .catch(() => false);

      if (isErrorVisible) {
        console.error('Test failed: Error box detected on the page.');
        await page.screenshot({ path: testInfo.outputPath('error_detected.png') });
        allure.attachment('Error Screenshot', await page.screenshot(), 'image/png');
        throw new Error('Test failed due to an error message on the page.');
      }
    });

    await test.step('Wait for Test Results', async () => {
      await page.waitForURL('**/result/**', { timeout: 20000 });
    });

    await test.step('Verify Results Page', async () => {
      const resultsHeading = page.locator('.result-summary');
      await expect(resultsHeading).toBeVisible();
      allure.attachment('Results Page Screenshot', await page.screenshot(), 'image/png');
    });
  } catch (error) {
    await page.screenshot({ path: testInfo.outputPath('failure.png') });
    allure.attachment('Failure Screenshot', await page.screenshot(), 'image/png');
    throw error;
  }
});
