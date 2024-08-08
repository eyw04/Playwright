import { test, expect, Browser, BrowserContext, Page } from '@playwright/test';
const testfilePath = '../Sandbox/test.pdf';

test('test1', async ({ browser }) => {

  // Launching seperate contexts for each account
  const clinicContext:BrowserContext = await browser.newContext(); 
  const clinicPage:Page = await clinicContext.newPage();

  const RCMContext:BrowserContext = await browser.newContext(); 
  const RCMPage:Page = await RCMContext.newPage();

  const dataContext:BrowserContext = await browser.newContext(); 
  const dataPage:Page = await dataContext.newPage();

  // Logging into accounts
  await curveLogin(clinicPage,'Monika.Clinics_all@chiroone.net');
  await curveLogin(RCMPage,'RCTMgr1@chiroone.net');
  await curveLogin(dataPage,'Matt.Data@chiroone.net');


  // ---------- Clinic ----------

  // loop to check for element to be visible

  // await expect(clinicPage.frameLocator('#schApp').getByRole('heading', { name: 'Naperville, IL' })).toBeVisible();

  // maybe try forcing to dev/staging curve site

  await clinicPage.getByRole('button', { name: 'New verification request' }).click();

  await clinicPage.waitForTimeout(1000);

  // 1) Enter Request Details
  await clinicPage.locator('div').filter({ hasText: /^Doctor Last Name \*$/ }).nth(3).click();      // Selects doctor
  await clinicPage.waitForTimeout(500);
  await clinicPage.locator('mat-option.mat-option').nth(0).click();
  await clinicPage.waitForTimeout(1000);
  await clinicPage.getByLabel('Patient Type *').locator('span').click();      
  await clinicPage.waitForTimeout(1000);
  await clinicPage.getByRole('option', { name: 'Create New' }).locator('span').click();
  await clinicPage.waitForTimeout(500);
  await clinicPage.getByLabel('Payor Type *').locator('span').click();
  await clinicPage.waitForTimeout(500);
  await clinicPage.getByRole('option', { name: 'Health Insurance' }).locator('span').click();
  await clinicPage.waitForTimeout(500);
  await clinicPage.getByLabel('Verification Reason *').locator('span').click();
  await clinicPage.waitForTimeout(500);
  await clinicPage.getByRole('option', { name: 'New Care Plan' }).click();
  await clinicPage.waitForTimeout(500);

  // 2) Enter Patient Details
  const patient_first_name:string = "test_first_name"; //let this be the test ID
  const patient_last_name:string = await genLastName();
  const patient_full_name = patient_first_name + " " + patient_last_name;
  await clinicPage.getByLabel('First Name *').fill(patient_first_name);
  await clinicPage.getByLabel('Last Name *', { exact: true }).fill(patient_last_name);
  await clinicPage.getByLabel('Date of Birth *').fill('12/12/1999');
  await clinicPage.getByLabel('Open calendar').click();

  let reportDate = await clinicPage.locator('button.mat-calendar-body-cell:not(.mat-calendar-body-disabled)');
  const num_availableDays = await reportDate.count();
  console.log(num_availableDays);
  if(num_availableDays < 3){
    //set available days to next month
    await clinicPage.getByLabel('Next month').click();
    await clinicPage.waitForTimeout(1000);
    reportDate = await clinicPage.locator('button.mat-calendar-body-cell:not(.mat-calendar-body-disabled)');
  }
  await reportDate.nth(2).click();

  await clinicPage.waitForTimeout(500);


  await clinicPage.locator('div#report-time > mat-form-field > div.mat-form-field-wrapper > div.mat-form-field-flex > div.mat-form-field-infix > mat-select').click();
  await clinicPage.locator('mat-option.mat-option').nth(0).click();

  //calendar day selector

  await clinicPage.getByPlaceholder('Insurance Carrier').click();
  await clinicPage.getByRole('option', { name: 'BCBS' }).locator('span').first().click();
  await clinicPage.getByLabel('Carrier Plan').locator('span').click();
  await clinicPage.getByText('PPO').click();

  // 3) Working Recommendations
  await clinicPage.getByLabel('Dx Code 1 *').fill('12345');
  await clinicPage.getByLabel('Dx Code 2 *').fill('12345');
  await clinicPage.getByLabel('Dx Code 3 *').fill('12345');


  await clinicPage.getByText('SelectSeverity *').click();
  await clinicPage.getByText('Mild Condition (VAS 1-3)').click();
  await clinicPage.getByText('SelectOnset *').click();
  await clinicPage.getByText('Acute (<6 weeks)').click();
  await clinicPage.getByText('SelectComplicating Factors *').click();
  await clinicPage.getByRole('option', { name: 'Yes' }).locator('span').click();
  await clinicPage.getByText('SelectRegions of Concerns *').click();
  await clinicPage.getByText('1-2 Regions', { exact: true }).click();
  await clinicPage.getByRole('button', { name: 'Quick Fill' }).click();
  await clinicPage.getByRole('menuitem', { name: '36 visits (Initial Care)' }).click();

  await clinicPage.locator('#mat-checkbox-6 > .mat-checkbox-layout > .mat-checkbox-inner-container').click();

  // 4) Paperwork
  await clinicPage.getByRole('button', { name: 'PAPERWORK' }).click();
  await clinicPage.waitForTimeout(500);
  await clinicPage.locator('#upload-btn').setInputFiles(testfilePath);

  await clinicPage.getByRole('button', { name: 'SUBMIT' }).click();

  // Loggin Out
  // await clinicPage.getByRole('button', { name: 'Account' }).click();
  // await clinicPage.getByRole('menuitem', { name: 'Logout' }).click();
  // await clinicPage.locator('[data-test-id="monika\\.clinics_all\\@chiroone\\.net"]').click();

  
  await clinicPage.waitForTimeout(2000);




  // ---------- RCM ----------


  //Verification Queue
  await RCMPage.reload();
  await RCMPage.waitForTimeout(1000);
  await RCMPage.getByRole('button', { name: 'go to verification queue' }).click();
  await RCMPage.waitForTimeout(3000);
  await RCMPage.getByRole('textbox', { name: 'Search for Task ID, First' }).fill(patient_full_name);  //name used
  await RCMPage.waitForTimeout(3000);
  await RCMPage.getByRole('textbox', { name: 'Search for Task ID, First' }).press('Enter');
  await clinicPage.waitForTimeout(2000);
  const task_ID = await RCMPage.locator('#link').textContent();                                 //task ID used
  await RCMPage.locator('#link').nth(0).click();

  await RCMPage.getByRole('button', { name: 'Take Action arrow_drop_down' }).click();
  await RCMPage.getByRole('menuitem', { name: 'Assign' }).click();
  await RCMPage.getByText('UnassignedAssigned To *').click();
  await RCMPage.locator('span.mat-option-text').nth(0).click();
  await RCMPage.getByRole('button', { name: 'ASSIGN' }).click();

  await RCMPage.waitForTimeout(1000);
  await RCMPage.getByRole('textbox', { name: 'Search for Task ID, First' }).fill(task_ID as string);
  await RCMPage.getByRole('textbox', { name: 'Search for Task ID, First' }).press('Enter');
  await RCMPage.locator('#link').nth(0).click();
  await RCMPage.waitForTimeout(1000);

  const patientDocuments:Page[] = [];
  RCMContext.on('page', newPage => { patientDocuments.push(newPage) }); 
  await RCMPage.getByRole('button', { name: 'OPEN ALL open_in_new' }).click();
  await RCMPage.waitForTimeout(3000);
  for (const newPage of patientDocuments) {
    await newPage.close();
  }
  await RCMPage.getByRole('button', { name: 'continue arrow_forward' }).click();

  await RCMPage.getByLabel('Search Templates').click();
  await RCMPage.waitForTimeout(1000);
  await RCMPage.getByRole('option', { name: 'CTY BCBSIL IN NETWORK' }).locator('span').first().click();
  await RCMPage.waitForTimeout(1000);
  await RCMPage.getByRole('button', { name: 'continue arrow_forward' }).click();

  await RCMPage.waitForTimeout(3000);
  await RCMPage.getByLabel('Reference Number *').fill('12345');
  await RCMPage.getByLabel('Name of Insurance Rep *').fill('name');
  await RCMPage.getByLabel('Select').locator('div').first().click();
  await RCMPage.waitForTimeout(1000);
  await RCMPage.getByText('Self').click();
  await RCMPage.waitForTimeout(1000);
  await RCMPage.getByLabel('Insurance Policy/ID Number *').fill('12345');
  await RCMPage.getByLabel('Group Number *').fill('12345');
  await RCMPage.getByLabel('Open calendar').click();
  await RCMPage.locator('button.mat-calendar-body-cell').nth(0).click();
  await RCMPage.waitForTimeout(1000);
  await RCMPage.getByRole('button', { name: 'save changes save' }).click();
  await RCMPage.waitForTimeout(3000);
  await RCMPage.getByRole('button', { name: 'continue arrow_forward' }).click();

  await RCMPage.waitForTimeout(5000);
  await RCMPage.locator('div').filter({ hasText: /^Primary Fee Schedule \*$/ }).nth(2).click();
  await RCMPage.waitForTimeout(2000);
  await RCMPage.locator('span.mat-option-text').nth(0).click();

  await RCMPage.waitForTimeout(1000);
  await RCMPage.getByRole('button', { name: 'CALCULATE' }).click();
  await RCMPage.waitForTimeout(1000);
  await RCMPage.getByRole('button', { name: 'SUBMIT TO CLINIC' }).click();
  // await RCMPage.getByRole('button', { name: 'Account' }).click();
  // await RCMPage.getByRole('menuitem', { name: 'Logout' }).click();
  // await RCMPage.locator('[data-test-id="rctmgr1\\@chiroone\\.net"]').click();


  // ---------- Clinic ----------

  await clinicPage.reload();
  await clinicPage.getByRole('textbox', { name: 'Search for Task ID, First' }).fill(task_ID as string); //use patient name or task ID
  await clinicPage.getByRole('textbox', { name: 'Search for Task ID, First' }).press('Enter');
  await clinicPage.locator('#link').nth(0).click();
  await clinicPage.locator('button').filter({ hasText: 'edit' }).click();
  await clinicPage.locator('input.mat-input-element ').first().fill(patient_first_name + "1"); //add first_name
  await clinicPage.waitForTimeout(1500);
  await clinicPage.locator('button').filter({ hasText: /^save$/ }).click();
  await clinicPage.waitForTimeout(1500);
  await clinicPage.getByRole('button', { name: 'Save Changes' }).click();
  await clinicPage.waitForTimeout(1500);
  await clinicPage.getByRole('button', { name: 'continue arrow_forward' }).click();
  await clinicPage.waitForTimeout(1500);
  await clinicPage.getByRole('button', { name: 'continue arrow_forward' }).click();
  await clinicPage.waitForTimeout(2000);
  await clinicPage.locator('tr:nth-child(28) > td:nth-child(3) > .mat-form-field > .mat-form-field-wrapper > .mat-form-field-flex > .mat-form-field-infix > input.mat-input-element').fill('1');
  await clinicPage.getByRole('button', { name: 'CALCULATE' }).click();
  await clinicPage.getByRole('button', { name: 'continue arrow_forward' }).click();
  await clinicPage.locator('.mat-slide-toggle-bar').first().click();
  await clinicPage.waitForTimeout(1000);
  await clinicPage.locator('.mat-slide-toggle-bar').first().click();
  await clinicPage.waitForTimeout(1000);
  await clinicPage.getByText('print').click();
  await clinicPage.waitForTimeout(500);
  await clinicPage.locator('div').filter({ hasText: /^close$/ }).click();


  await clinicPage.getByLabel('Patient Total').fill('1000.00');
  await clinicPage.getByRole('button', { name: 'CALCULATE' }).click();
  await clinicPage.waitForTimeout(1000);
  await clinicPage.getByText('refresh').click();
  await clinicPage.waitForTimeout(1000);
  await clinicPage.getByText('2 PAYMENTS10% SAVINGS$342.97').click();
  await clinicPage.waitForTimeout(1000);
  await clinicPage.locator('div.ng-star-inserted').nth(1).click();
  await clinicPage.waitForTimeout(1000);


  await clinicPage.getByLabel('Open calendar').nth(1).click();

  await clinicPage.waitForTimeout(500);
  let calendar_selector = clinicPage.locator('button.mat-calendar-body-cell:not(.mat-calendar-body-disabled)');
  if(await calendar_selector.count() < 2){
    await clinicPage.getByLabel('Next month').click();
    await clinicPage.waitForTimeout(500);
    calendar_selector = clinicPage.locator('button.mat-calendar-body-cell:not(.mat-calendar-body-disabled)');
  }
  await calendar_selector.nth(1).click();
  await clinicPage.waitForTimeout(1000);
  await clinicPage.getByText('Non-Credit Card').click();
  await clinicPage.waitForTimeout(1000);
  await clinicPage.getByRole('button', { name: 'GENERATE CPA' }).click();
  await clinicPage.waitForTimeout(1000);
  await clinicPage.locator('div').filter({ hasText: /^close$/ }).click();
  await clinicPage.waitForTimeout(1000);
  await clinicPage.getByRole('button', { name: 'Continue' }).click();
  await clinicPage.waitForTimeout(2000);

  await clinicPage.getByLabel('Select').click();
  await clinicPage.waitForTimeout(1000);
  await clinicPage.getByText('Care Plan', { exact: true }).click();
  await clinicPage.waitForTimeout(1000);
  await clinicPage.getByLabel('Open calendar').click();
  await clinicPage.waitForTimeout(1000);
  await clinicPage.locator('button.mat-calendar-body-cell:not(.mat-calendar-body-disabled)').nth(1).click();
  await clinicPage.waitForTimeout(1000);
  await clinicPage.locator('#upload-btn').setInputFiles(testfilePath);
  await clinicPage.waitForTimeout(500);
  await clinicPage.getByRole('button', { name: 'UPDATE RCM' }).click();
  await clinicPage.waitForTimeout(1000);



  //----------- Data Entry Manager ----------
  await dataPage.reload();
  await dataPage.getByRole('textbox', { name: 'Search for Task ID, First' }).fill(patient_full_name as string); //name
  await dataPage.waitForTimeout(500);
  await dataPage.getByRole('textbox', { name: 'Search for Task ID, First' }).press('Enter');
  await dataPage.waitForTimeout(1000);
  await dataPage.locator('tr.mat-row').first().click();
  await dataPage.waitForTimeout(1500);
  await dataPage.getByRole('button', { name: 'Continue arrow_forward' }).click();
  await dataPage.waitForTimeout(1500);
  await dataPage.locator('.mat-checkbox-inner-container').click();
  await dataPage.waitForTimeout(500);
  await dataPage.getByRole('button', { name: 'Continue arrow_forward' }).click();
  await dataPage.waitForTimeout(1500);
  await dataPage.locator('.mat-checkbox-inner-container').click();
  await dataPage.waitForTimeout(500);
  await dataPage.getByRole('button', { name: 'Continue arrow_forward' }).click();
  await dataPage.waitForTimeout(1500);
  await dataPage.locator('.mat-checkbox-inner-container').click();
  await dataPage.waitForTimeout(500);
  await dataPage.getByRole('button', { name: 'Complete arrow_forward' }).click();
  await expect(dataPage).toHaveURL(/.*\/data-entry-queue/);


});

async function curveLogin(page:Page, username:string) {
  await page.goto('https://stagingcurve.medullallc.com/');
  await page.getByLabel('Enter your email, phone, or').fill(username);
  await page.getByLabel('Enter your email, phone, or').press('Enter');
  await page.getByRole('button', { name: 'Next' }).click();
  await page.getByLabel('Password').fill('Welcome4$');
  await page.getByLabel('Password').press('Enter');
  await page.getByRole('button', { name: 'No' }).click();
}

async function genLastName() {
  const current_time = new Date();
  return current_time.toISOString();
}