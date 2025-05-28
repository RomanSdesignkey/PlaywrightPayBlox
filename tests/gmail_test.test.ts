import { test, expect } from '@playwright/test';
import { allure } from 'allure-playwright';
import getLatestEmail from '../gmail';  // ✅ Fix: Use import instead of require

test('Verify email code in Playwright', async ({ page }) => {
    // await page.goto('https://yourapp.com/register');

    // // Submit registration
    // await page.fill('#email', 'yourgmail@gmail.com');
    // await page.click('#submit');

    // // Wait & fetch latest email
    // await page.waitForTimeout(30000);
    const emailContent = await getLatestEmail();


    console.log(`Email Content: ${emailContent}`);

    // // Extract verification code using regex
    // const codeMatch = emailContent.match(/Your verification code is (\d{6})/);
    // const verificationCode = codeMatch ? codeMatch[1] : null;

    // if (!verificationCode) {
    //     throw new Error("No verification code found in email");
    // }

    // console.log(`Extracted Code: ${verificationCode}`);

    // // Enter code in the app
    // await page.fill('#verification_code', verificationCode);
    // await page.click('#verify');

    //await expect(page.locator('.success-message')).toHaveText('Verification successful!');
});
