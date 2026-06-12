import { test, expect } from '@playwright/test';

const APP_URL = 'https://saucedemo.com';

test.describe('Sauce Labs — 5 Failure', () => {

  test('Failure 1 — Username locator has an incorrect ID ERROR', async ({ page }) => {
    await page.goto(APP_URL);
    const brokenUsernameInput = page.locator('#user-name-wrong-id');
    await brokenUsernameInput.fill('standard_user', { timeout: 2000 });
  });

  test('Failure 2 — Page header title does not match text pattern', async ({ page }) => {
    await page.goto(APP_URL);
    await expect(page).toHaveTitle(/Testing Labs/, { timeout: 2000 });
  });

  test('Failure 3 — Iincorrect web address domain', async ({ page }) => {
    await page.goto('https://saucedemojayesh.com');
  });

  test('Failure 4 — Text input selector matches multiple input tags', async ({ page }) => {
    await page.goto(APP_URL);
    const genericInput = page.locator('input');
    await genericInput.fill('standard_user');
  });

  test('Failure 5 — Login button hidden via CSS ', async ({ page }) => {
    await page.goto(APP_URL);
    const loginButton = page.locator('#login-button');
    await loginButton.evaluate((element) => {
      (element as HTMLElement).style.display = 'none';
    });
    await loginButton.click({ timeout: 2000 });
  });

});
