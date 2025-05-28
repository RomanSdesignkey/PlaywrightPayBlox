// Optimized test for registration using playwright
import { test, expect } from '@playwright/test';
import { allure } from 'allure-playwright';
//const fs = require('fs');

//import fs
import fs from 'fs'; // Use import for the fs module    

import getLatestPlayboxEmail from '../gmail';  // Use import for the email helper function

test('Accepting and signing offer', async ({ page }) => {
  await allure.step('Wait for homepage to fully load', async () => {
    await page.goto('https://payblox.xyz/merchant');
    await page.waitForLoadState('networkidle');  // Wait until no network requests are pending
  });

  await allure.step('Verify the page title', async () => {
    await expect(page).toHaveTitle('Sign-in');
  });

  await allure.step('Search and click Use email button', async () => {
    const emailLoginButton = page.locator('#secondary_button');
    await emailLoginButton.waitFor({ state: 'visible' });
    await emailLoginButton.click();
  });

  await allure.step('Enter email address', async () => {
    const emailField = page.locator('#form_input');
    await emailField.waitFor({ state: 'visible' });

    // Читаем креды из JSON-файла (формат "email: xxx\npassword: yyy")
    const rawData = fs.readFileSync('/app/data/test-data.json', 'utf-8');
    const creds = Object.fromEntries(rawData.split('\n').map(line => line.split(': ').map(item => item.trim())));

    //fill email field with email address
    await emailField.fill(`${creds.email}`);
    });


    await allure.step('Click on Get a Code Button', async () => {
        const nextButton = page.locator('#submit_button');
        await nextButton.waitFor({ state: 'visible' });
        await nextButton.click();
      });
    
      await allure.step('Wait for email and extract verification code', async () => {
        
        //wait for new email
        await page.waitForTimeout(10000);  // Wait for email
    
        //get the latest email
        const emailContent = await getLatestPlayboxEmail();
        
        const match = emailContent.match(/Your verification code is: (\d{6})/);
        if (!match) throw new Error('Could not find verification code in email.');
        const verificationCode = match[1];
        console.log(`Extracted Code: ${verificationCode}`);
    
        const codeField = page.locator('#form_input');
        await codeField.waitFor({ state: 'visible' });
        await codeField.fill(verificationCode);
      });
    
      await allure.step('Click on Sign In Button', async () => {
        const nextButton = page.locator('#submit_button');
        await nextButton.waitFor({ state: 'visible' });
        await nextButton.click();
      });
      
    //wait for the page to load and check if div contains text "Welcome, " is visible
    await allure.step('Verify successful registration', async () => {
        await page.waitForSelector('div:has-text("Welcome, ")');
        await expect(page.locator('div:has-text("Welcome, ")').first()).toBeVisible();
    });

    //get a element with href containing "/merchant/offers"
    await allure.step('Click on Offers', async () => {
        const offersButton = page.locator('a[href="/merchant/offers"]');
        await offersButton.waitFor({ state: 'visible' });
        await offersButton.click();
    });

    //get div element contains text "Offers received:" and get parent div element that contains role ="button" and click it 
    await allure.step('Click on Accept Offer', async () => {
      const acceptButton = page.locator('div[role="button"]:has-text("Offers received:")');
      //get first found element
      await acceptButton.first().click();
    });

    //search for h2 element with id="draggable-dialog-title" and contains text "Offer details" and check if it is visible
    await allure.step('Verify Offer Details', async () => {
      await page.waitForSelector('h2:has-text("Offer details")');
      await expect(page.locator('h2:has-text("Offer details")').first()).toBeVisible();
    });

    //search for button element with text "Accept" and click it
    await allure.step('Click on Accept Button', async () => {
      const acceptButton = page.locator('button:has-text("Accept")');
      await acceptButton.first().click();
    });

  

    //search for button element with text "Yes" and click it
    await allure.step('Click on Yes Button', async () => {
      const acceptButton = page.locator('button:has-text("Yes")');
      await acceptButton.first().click();
    });

    //search for h2 element with id="draggable-dialog-title" and contains text "Processor requires additional information" and check if it is visible
    await allure.step('Verify Additional Information', async () => {
      await page.waitForSelector('h2:has-text("Processor requires additional information")');
      await expect(page.locator('h2:has-text("Processor requires additional information")').first()).toBeVisible();
    });

    //search for button element with text "Continue" and click it
    await allure.step('Click on Continue Button', async () => {
      const acceptButton = page.locator('button:has-text("Continue")');
      await acceptButton.first().click();
    });

    //wait for new tab is oppened and contains title "Zoho Sign"
    await allure.step('Verify Zoho Sign Page', async () => {
      const newPage = await page.waitForEvent('popup');
      await expect(newPage).toHaveTitle('Zoho Sign');
    });

    //search for element with id=ember16 and click it
    await allure.step('Click on Checkbox', async () => {
      const acceptButton = page.locator('#ember16');
      await acceptButton.first().click();
    });

    //search for element with id="agree-btn" that contains text "Agree & Continue" and click it
    await allure.step('Click on Agree & Continue Button', async () => {
      const acceptButton = page.locator('#agree-btn:has-text("Agree & Continue")');
      await acceptButton.first().click();
    });

    //search for element with field_name="Federal Tax ID" and fill it with "123456789"
    await allure.step('Fill Federal Tax ID', async () => {
      const acceptButton = page.locator('input[field_name="Federal Tax ID"]');
      await acceptButton.first().fill("123456789");
    });

    //search for element with field_name="Date Bus. Started" and click it
    await allure.step('Click on Date Bus. Started', async () => {
      const acceptButton = page.locator('input[field_name="Date Bus. Started"]');
      await acceptButton.first().click();
    });

    //search for element with class="date-container-days" that contains data-action="selectDay" and class="day today" and click it
    await allure.step('Click on Today', async () => {
      const acceptButton = page.locator('.date-container-days[data-action="selectDay"] .day.today');
      await acceptButton.first().click();
    });

    //search for element with field_name="Business Address" and fill it with "123 Main St"
    await allure.step('Fill Business Address', async () => {
      const acceptButton = page.locator('input[field_name="Business Address"]');
      await acceptButton.first().fill("123 Main St");
    });

    //search for element with field_name="Business City" and fill it with "New York"
    await allure.step('Fill Business City', async () => {
      const acceptButton = page.locator('input[field_name="Business City"]');
      await acceptButton.first().fill("New York");
    });


    //search for element with field_name="Business Zip" and fill it with "10001"
    await allure.step('Fill Business Zip', async () => {
      const acceptButton = page.locator('input[field_name="Business Zip"]');
      await acceptButton.first().fill("10001");
    });

    //search for element with field_name="Business Phone" and fill it with "1234567890"
    await allure.step('Fill Business Phone', async () => {
      const acceptButton = page.locator('input[field_name="Business Phone"]');
      await acceptButton.first().fill("1234567890");
    });

    //search for element with field_name="Explanation of Services" and fill it with "Test"
    await allure.step('Fill Explanation of Services', async () => {
      const acceptButton = page.locator('textarea[field_name="Explanation of Services"]');
      await acceptButton.first().fill("Test");
    });

    //search for element with field_name="Business Website" and fill it with "https://test.com"
    await allure.step('Fill Business Website', async () => {
      const acceptButton = page.locator('input[field_name="Business Website"]');
      await acceptButton.first().fill("https://test.com");
    });

    //search for element with field_name="Legal Address" and fill it with "123 Main St"
    await allure.step('Fill Legal Address', async () => {
      const acceptButton = page.locator('input[field_name="Legal Address"]');
      await acceptButton.first().fill("123 Main St");
    });

    //seach for element with field_name="Legal City" and fill it with "New York"
    await allure.step('Fill Legal City', async () => {
      const acceptButton = page.locator('input[field_name="Legal City"]');
      await acceptButton.first().fill("New York");
    });

    //search for element with field_name="Legal Zip" and fill it with "10001"
    await allure.step('Fill Legal Zip', async () => { 
      const acceptButton = page.locator('input[field_name="Legal Zip"]');
      await acceptButton.first().fill("10001");
    });

    //search for element with field_name="Owner Address" and fill it with "123 Main St"
    await allure.step('Fill Owner Address', async () => {
      const acceptButton = page.locator('input[field_name="Owner Address"]');
      await acceptButton.first().fill("123 Main St");
    });

    //search for element with field_name="Owner City" and fill it with "New York"
    await allure.step('Fill Owner City', async () => {
      const acceptButton = page.locator('input[field_name="Owner City"]');
      await acceptButton.first().fill("New York");
    });

    //search for element with field_name="Owner State" and fill it with "NY"
    await allure.step('Fill Owner State', async () => {
      const acceptButton = page.locator('input[field_name="Owner State"]');
      await acceptButton.first().fill("NY");
    });

    //search for element with field_name="Owner Zip" and fill it with "10001"
    await allure.step('Fill Owner Zip', async () => {
      const acceptButton = page.locator('input[field_name="Owner Zip"]');
      await acceptButton.first().fill("10001");
    });

    //search for element with field_name="Owner County" and fill it with "New York"
    await allure.step('Fill Owner County', async () => {
      const acceptButton = page.locator('input[field_name="Owner County"]');
      await acceptButton.first().fill("New York");
    });

    //search for element with field_name="Owner SSN" and fill it with "123456789"
    await allure.step('Fill Owner SSN', async () => {
      const acceptButton = page.locator('input[field_name="Owner SSN"]');
      await acceptButton.first().fill("123456789");
    });

    //search for element with field_name="Owner DL" and fill it with "123456789"
    await allure.step('Fill Owner DL', async () => {
      const acceptButton = page.locator('input[field_name="Owner DL"]');
      await acceptButton.first().fill("123456789");
    });

    //search for element with field_name="Gross Monthly Volume" and fill it with "1000"
    await allure.step('Fill Gross Monthly Volume', async () => {  
      const acceptButton = page.locator('input[field_name="Gross Monthly Volume"]');
      await acceptButton.first().fill("1000");
    });

    //search for element with field_name="Monthly Visa/MC/Discovery Volume" and fill it with "1000"
    await allure.step('Fill Monthly Visa/MC/Discovery Volume', async () => {
      const acceptButton = page.locator('input[field_name="Monthly Visa/MC/Discovery Volume"]');
      await acceptButton.first().fill("1000");
    });

    //search for element with field_name="Monthly AMEX Volume" and fill it with "1000"
    await allure.step('Fill Monthly AMEX Volume', async () => {
      const acceptButton = page.locator('input[field_name="Monthly AMEX Volume"]');
      await acceptButton.first().fill("1000");
    });

    //search for element with field_name="Highest Ticket" and fill it with "1000"
    await allure.step('Fill Highest Ticket', async () => {
      const acceptButton = page.locator('input[field_name="Highest Ticket"]');
      await acceptButton.first().fill("1000");
    });

    //search for element with field_name="E-commerce website" and fill it with "5"
    await allure.step('Fill E-commerce website', async () => {
      const acceptButton = page.locator('input[field_name="E-commerce website"]');
      await acceptButton.first().fill("5");
    });

    //search for element with field_name="Business Bank Name" and fill it with "Test"
    await allure.step('Fill Business Bank Name', async () => {
      const acceptButton = page.locator('input[field_name="Business Bank Name"]');
      await acceptButton.first().fill("Test");
    });

    //search for element with field_name="Business Routing" and fill it with "123456789"
    await allure.step('Fill Business Routing', async () => {  
      const acceptButton = page.locator('input[field_name="Business Routing"]');
      await acceptButton.first().fill("123456789");
    });

    //search for element with field_name="Business Acct" and fill it with "123456789"
    await allure.step('Fill Business Acct', async () => {
      const acceptButton = page.locator('input[field_name="Business Acct"]');
      await acceptButton.first().fill("123456789");
    });

    //search for element with field_name="Qualified" and fill it with "123"
    await allure.step('Fill Qualified', async () => {
      const acceptButton = page.locator('input[field_name="Qualified"]');
      await acceptButton.first().fill("123");
    });

    //search for element with field_name="Mid qualified" and fill it with "123"
    await allure.step('Fill Mid qualified', async () => {
      const acceptButton = page.locator('input[field_name="Mid qualified"]');
      await acceptButton.first().fill("123");
    });

    //search for element with field_name="Non qualified" and fill it with "123"
    await allure.step('Fill Non qualified', async () => {
      const acceptButton = page.locator('input[field_name="Non qualified"]');
      await acceptButton.first().fill("123");
    });

    //search for element with field_name="Transaction rebate" and fill it with "123"
    await allure.step('Fill Transaction rebate', async () => {
      const acceptButton = page.locator('input[field_name="Transaction rebate"]');
      await acceptButton.first().fill("123");
    });

    //search for element with field_name="Special features" and fill it with "Test"
    await allure.step('Fill Special features', async () => {
      const acceptButton = page.locator('input[field_name="Special features"]');
      await acceptButton.first().fill("Test");
    });

    
    





    

});


