import { test, expect } from '@playwright/test';
import { allure } from 'allure-playwright';

test.describe('E-commerce tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('https://practicesoftwaretesting.com/');

    // Inject cursor & click effect
    await page.evaluate(() => {
      if (window.__cursorEffectAdded) return;
      window.__cursorEffectAdded = true;

      // Create cursor element
      const cursor = document.createElement('div');
      cursor.style.position = 'absolute';
      cursor.style.width = '10px';
      cursor.style.height = '10px';
      cursor.style.border = '2px solid red';
      cursor.style.borderRadius = '50%';
      cursor.style.pointerEvents = 'none';
      cursor.style.zIndex = '9999';
      cursor.style.transition = 'transform 0.05s linear';
      document.body.appendChild(cursor);

      // Track mouse movement
      document.addEventListener('mousemove', (event) => {
        cursor.style.transform = `translate(${event.clientX - 5}px, ${event.clientY - 5}px)`;
      });

      // Click effect
      document.addEventListener('click', (event) => {
        const circle = document.createElement('div');
        circle.style.position = 'absolute';
        circle.style.width = '20px';
        circle.style.height = '20px';
        circle.style.background = 'red';
        circle.style.borderRadius = '50%';
        circle.style.top = `${event.clientY - 10}px`;
        circle.style.left = `${event.clientX - 10}px`;
        circle.style.opacity = '0.7';
        circle.style.pointerEvents = 'none';
        circle.style.transition = 'opacity 0.5s ease-out';

        document.body.appendChild(circle);
        setTimeout(() => circle.remove(), 500);
      });
    });
  });

  test('should add a product to the cart', async ({ page }) => {
    // Set test metadata for Allure
    allure.description('Test to verify that adding a product to the cart works correctly');
    allure.severity('critical');

    await allure.step('Wait for homepage to fully load', async () => {
      await page.waitForLoadState('networkidle');
      await page.waitForSelector('.container .card', { timeout: 20000 });

      // Ensure cursor visibility
      await page.addStyleTag({
        content: `* { cursor: auto !important; }`,
      });
    });

    await allure.step('Click the first product', async () => {
      const firstProduct = page.locator('.container .card').first();
      await firstProduct.waitFor({ state: 'visible', timeout: 20000 });
      await firstProduct.click();
    });

    await allure.step('Verify navigation to product detail page', async () => {
      await page.waitForURL('**/product/**', { timeout: 15000 });
    });

    await allure.step('Click the "Add to Cart" button', async () => {
      const addToCartButton = page.locator('text=Add to Cart');
      await addToCartButton.waitFor({ state: 'visible', timeout: 10000 }); // Ensure button is visible
      await addToCartButton.click();
    });

    await allure.step('Verify the product was added successfully', async () => {
      const cartCounter = page.locator('#lblCartCount');
      await expect(cartCounter).toHaveText('1');
    });
  });
});
