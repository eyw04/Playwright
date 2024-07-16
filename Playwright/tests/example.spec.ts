import { test, expect, Browser, Page } from '@playwright/test';
import {webkit, chromium, firefox} from  'playwright';

test('test', async() => {
  //loading browser
  const broswer:Browser = await chromium.launch({headless: false});
  const page:Page = await broswer.newPage();
  await page.goto('https://www.chiroone.com/');
  //first page
  await page.frameLocator('#schApp').getByPlaceholder('First Name').click();
  await page.frameLocator('#schApp').getByPlaceholder('First Name').fill('test');
  await page.frameLocator('#schApp').getByPlaceholder('First Name').press('Tab');
  await page.frameLocator('#schApp').getByPlaceholder('Last Name').fill('test');
  await page.frameLocator('#schApp').getByPlaceholder('Last Name').press('Tab');
  await page.frameLocator('#schApp').getByPlaceholder('Mobile Phone Number').click();
  await page.frameLocator('#schApp').getByPlaceholder('Mobile Phone Number').fill('11231231234');
  await page.frameLocator('#schApp').getByPlaceholder('Email Address').click();
  await page.frameLocator('#schApp').getByPlaceholder('Email Address').fill('test@test.com');
  await page.frameLocator('#schApp').getByLabel('Government Funded (Medicare,').check();
  await page.frameLocator('#schApp').getByPlaceholder('Zip Code').fill('60523');
  await page.frameLocator('#schApp').getByPlaceholder('Zip Code').press('Enter');
  await page.waitForTimeout(1000); // make this a better check

  await page.frameLocator('#schApp').getByRole('button', { name: 'Claim Your Offer!' }).click();
  //second page
  await page.waitForTimeout(3000); // make this a better check
  // await page.waitForSelector('#appointmentInformation_appointmentDate', {timeout: 60000});
  await page.frameLocator('#schApp').locator('#appointmentInformation_appointmentDate').click();
  await page.waitForTimeout(3000);
   
  let availableDays = await page.frameLocator('#schApp').locator('td[title = "Available"]');
  const num_availableDays = await availableDays.count();
  if(num_availableDays < 3){
    //set available days to next month
    await page.frameLocator('#schApp').locator('a[data-handler = "next"]').click();
    availableDays = await page.frameLocator('#schApp').locator('td[title = "Available"]');
  }

  await availableDays.nth(2).locator('a').click();
  await page.waitForTimeout(3000); // make this a better check
  console.log(await page.frameLocator('#schApp').locator('fieldset.time-checkbox').count());
  await page.frameLocator('#schApp').locator('fieldset.time-checkbox').nth(0).click();
  await page.frameLocator('#schApp').getByRole('button', { name: 'Confirm' }).click();

  //Final page
  await page.waitForTimeout(3000);
  await expect(page).toHaveURL(/.*\/thank-you-requests/);
  
  console.log("complete")
});