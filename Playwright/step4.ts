import { test, expect } from '@playwright/test';
const testfilePath = '../Sandbox/test.pdf';

test('test1', async ({ page }) => {

  // Data Entry Specialist (Manager)

  await page.goto('https://stagingcurve.medullallc.com/');
  await page.getByPlaceholder('Email, phone, or Skype').click();
  await page.getByPlaceholder('Email, phone, or Skype').fill('Matt.Data@chiroone.net');
  await page.getByRole('button', { name: 'Next' }).click();
  await page.getByRole('button', { name: 'Next' }).click();
  await page.getByLabel('Password').fill('Welcome4$');
  await page.getByLabel('Password').press('Enter');

  await page.getByRole('button', { name: 'No' }).click();


  
  await page.getByRole('textbox', { name: 'Search for Task ID, First' }).fill('test1 test1'); //name
  await page.getByRole('textbox', { name: 'Search for Task ID, First' }).press('Enter');
  await page.locator('div.bold').nth(0).click();

  await page.getByRole('button', { name: 'Continue arrow_forward' }).click();
  await page.locator('.mat-checkbox-inner-container').click();
  await page.getByRole('button', { name: 'Continue arrow_forward' }).click();
  await page.locator('.mat-checkbox-inner-container').click();
  await page.getByRole('button', { name: 'Continue arrow_forward' }).click();
  await page.locator('.mat-checkbox-inner-container').click();
  await page.getByRole('button', { name: 'Complete arrow_forward' }).click();

  await page.getByRole('button', { name: 'Account' }).click();
  await page.getByRole('menuitem', { name: 'Logout' }).click();
  await page.locator('[data-test-id="matt\\.data\\@chiroone\\.net"]').click();


});
