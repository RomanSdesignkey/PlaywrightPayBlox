// Optimized test for registration using playwright
import { test, expect } from '@playwright/test';
import { allure } from 'allure-playwright';
import fs from 'fs';  // Import fs for file system operations
import getLatestPlayboxEmail from '../gmail';  // Use import for the email helper function

test('Navigate to URL and complete registration', async ({ page }) => {
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

    const emailDate = new Date(Date.now());
    // Convert emailDate to datetime formatted string with mask like 'dd+MM+yy+HHmm'
    const formattedEmailDate = `${emailDate.getDate().toString().padStart(2, '0')}+${(emailDate.getMonth() + 1).toString().padStart(2, '0')}+${emailDate.getFullYear().toString().slice(-2)}+${emailDate.getHours().toString().padStart(2, '0')}+${emailDate.getMinutes().toString().padStart(2, '0')}`;

    const emailValue = `ntlkulachenko+${formattedEmailDate}@gmail.com`;


    //fill email field with generated email address
    await emailField.fill(emailValue);

    // **Сохраняем данные в нужном формате**
    const credentials = `email: ${emailValue}\n`;
    fs.writeFileSync('/app/data/test-data.json', credentials);

    console.log(`✅ Учетные данные сохранены:\n${credentials}`);

    //await emailField.fill('ntlkulachenko+140225m1@gmail.com');
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

  await allure.step('Verify Next Step page title', async () => {
    await page.waitForFunction(() => document.title.includes('PayBlox App | Start Here'));
    await expect(page).toHaveTitle('PayBlox App | Start Here | Free Marketplace for Merchant Accounts');
  });

  await allure.step('Verify and fill Business Information Form', async () => {
    const businessInfo = page.locator('p:has-text("Business Information")');
    await expect(businessInfo).toBeVisible();
  });

  await allure.step('Input Business name and DBA', async () => {
    const businessNameField = page.locator('input[name="businessName"]');
    await businessNameField.fill('Test Business Name');

    const dbaField = page.locator('input[name="dba"]');
    await dbaField.fill('Test DBA');
  });

  await allure.step('Select Business Location and Structure', async () => {
    const businessLocation = page.locator('div[id="businessLocation"]');
    await businessLocation.click({  clickCount: 2,  position: { x: 5, y: 5 } });  // Click near the top-left corner (start)

    const locationList = page.locator('ul[aria-labelledby="businessLocation-label"] li:nth-child(2)');
    await locationList.waitFor({ state: 'visible' });
    await locationList.click();

    const businessStructure = page.locator('div[id="structure"]');
    await businessStructure.click();
    const structureList = page.locator('ul[aria-labelledby="structure-label"] li:nth-child(2)');
    await structureList.waitFor({ state: 'visible' });
    await structureList.click();
  });

  await allure.step('Select Retail Card Sales and Industry Classification', async () => {
    const retailCardSales = page.locator('input[name="isCardRetail"]');
    await retailCardSales.click();

    const industryClassification = page.locator('label:has-text("Industry classification") ~ div');
    await industryClassification.click({position: { x: 5, y: 5 } });  // Click near the top-left corner (start)
    const industry = page.locator('div[role="presentation"] li:has-text("Animal Doctors, Hospitals - 0742")');
    await industry.waitFor({ state: 'visible' });
    await industry.click();
  });

  await allure.step('Click on Continue Button', async () => {
    const continueButton = page.locator('button:has-text("Continue")');
    const box = await continueButton.boundingBox();  // Get element position and size
    if (box) {
      await page.mouse.click(box.x + 15, box.y + 15, {clickCount: 2});  // Click at (15, 15) relative to top-left corner
    } else {
      throw new Error('Bounding box not found for the continue button.');
    }
  });

  await allure.step('Verify and fill Business Numbers', async () => {
    const businessNumbers = page.locator('p:has-text("Business Numbers")');
    await expect(businessNumbers).toBeVisible();
  });

  await allure.step('Established In', async () => {

    const industryClassification = page.locator('label:has-text("Established In*") ~ div');
    await industryClassification.click({position: { x: 5, y: 5 } });  // Click near the top-left corner (start)
    const industry = page.locator('div[role="presentation"] li:nth-child(2)');
    await industry.waitFor({ state: 'visible' });
    await industry.click();
  });

  await allure.step('Minimun Monthly Volume', async () => {
    const businessLocation = page.locator('div[aria-labelledby="minimumMonthlyVolume-label minimumMonthlyVolume"]');
    await businessLocation.click({position: { x: 5, y: 5 } });  // Click near the top-left corner (start)

    const locationList = page.locator('ul[aria-labelledby="minimumMonthlyVolume-label"] li:nth-child(2)');
    await locationList.waitFor({ state: 'visible' });
    await locationList.click();
  });

  //search for input field with name="averageTicket"
  await allure.step('Average Ticket', async () => {
    const averageTicket = page.locator('input[name="averageTicket"]');
    await averageTicket.fill('100');
  });

  //search for input field with name="highestSingleTransaction"
  await allure.step('Highest Single Transaction', async () => {
    const highestSingleTransaction = page.locator('input[name="highestSingleTransaction"]');
    await highestSingleTransaction.fill('1000');
  });

  await allure.step('Click on Continue Button', async () => {
    const continueButton = page.locator('button:has-text("Continue")');

    // // Get the button's bounding box
    // const box = await continueButton.boundingBox();
    // if (box) {
    //     await page.mouse.move(box.x + 15, box.y + 15); // Move to button
    //     await page.mouse.click(box.x + 15, box.y + 15); // Click on it
    // }

    await page.evaluate(() => {
        [...document.querySelectorAll('button')]
            .find(btn => btn.innerText.includes('Continue'))
            ?.click();
    });
  });

  await allure.step('Verify and fill Business Preferences', async () => {
    const businessPreference = page.locator('p:has-text("Business Preferences")');
    await expect(businessPreference).toBeVisible();
  });

  await allure.step('Click on Continue Button', async () => {
    const continueButton = page.locator('button:has-text("Continue")');
    const box = await continueButton.boundingBox();  // Get element position and size
    if (box) {
      await page.mouse.click(box.x + 15, box.y + 15, {clickCount: 2});  // Click at (15, 15) relative to top-left corner
    } else {
      throw new Error('Bounding box not found for the continue button.');
    }
  });

  await allure.step('Verify and fill Business Representative', async () => {
    const businessRepresentative = page.locator('p:has-text("Business Representative")');
    await expect(businessRepresentative).toBeVisible();
  });

  await allure.step('Input Business Representative Information', async () => {
    const firstName = page.locator('input[name="firstName"]');
    await firstName.fill('Test First Name');

    const lastName = page.locator('input[name="lastName"]');
    await lastName.fill('Test Last Name');

    const phoneNumber = page.locator('input[name="phoneNumber"]');
    //generate random unique phone number
    const phoneNumberGenerator = Math.floor(1000000000 + Math.random() * 9000000000);  // Ensure it's a 10-digit number
    await phoneNumber.fill(phoneNumberGenerator.toString());

    const dateOfBirth = page.locator('input[name="dateOfBirth"]');
    await dateOfBirth.pressSequentially('03031900');


    await page.evaluate(() => {
        [...document.querySelectorAll('label')]
            .find(btn => btn.innerText.includes('Please review all the details you entered are correct'))
            ?.click();
    });


    await page.evaluate(() => {
      [...document.querySelectorAll('label')]
          .find(btn => btn.innerText.includes('I agree with PayBlox'))
          ?.click();
    });

  });

    await allure.step('Click on Finish Button', async () => {
      const finishButton = page.locator('button:has-text("Finish")');

      await page.evaluate(() => {
        [...document.querySelectorAll('button')]
            .find(btn => btn.innerText.includes('Finish'))
            ?.click();
      });
    });


  // Check if "This phone number is already used!" appears, enter a new random phone number if it does, and click Finish again
  await allure.step('Handle potential duplicate phone number', async () => {
    let isPhoneUsed = true;
    while (isPhoneUsed) {
      const phoneNumberError = page.locator('p:has-text("This phone number is already used!")');
      
      // Check if the error message is visible
      if (await phoneNumberError.isVisible()) {
        console.log('Phone number already used, generating a new one...');
        const phoneNumber = page.locator('input[name="phoneNumber"]');
        
        // Generate a new random phone number
        const phoneNumberGenerator = Math.floor(1000000000 + Math.random() * 9000000000);  // Ensure it's a 10-digit number
        await phoneNumber.fill(phoneNumberGenerator.toString());

        // Click Finish button again
        await page.evaluate(() => {
          [...document.querySelectorAll('button')]
              .find(btn => btn.innerText.includes('Finish'))
              ?.click();
        });

        // Wait briefly before checking the error again
        await page.waitForTimeout(2000);
      } else {
        isPhoneUsed = false;
      }
    }
  });


  //wait for the page to load and check if div contains text "Welcome, " is visible
  await allure.step('Verify successful registration', async () => {
    await page.waitForSelector('div:has-text("Welcome, ")');
    await expect(page.locator('div:has-text("Welcome, ")').first()).toBeVisible();
  });

  


});
