import { test, expect, Browser, BrowserContext, Page } from '@playwright/test';
const testfilePath = '../Sandbox/test.pdf';

export class CurveAccount {
    private accountContext: BrowserContext | null = null;
    protected accountPage: Page | null = null;
    protected patientFirstName:string = "";
    protected patientLastName:string = "";
    protected patientFullName:string = "";
    protected taskID:string | null = null;
    protected additionalPages:Page[] = [];
  
    constructor() {}
  
    public async initialize(inputBrowser:Browser): Promise<void> {
      this.accountContext = await inputBrowser.newContext();
      this.accountPage = await this.accountContext.newPage();
    }
  
    // pass locator into function
    protected async dateSelector(calendarPath:string, nextMonthPath:string, datePath:string): Promise<void> {
      if (this.accountPage !== null) {
        await this.accountPage.locator(calendarPath).click();
        await this.accountPage.waitForTimeout(250);
        let avaliableDates = this.accountPage.locator(datePath);
        const numAvailableDays = await avaliableDates.count();
        if(numAvailableDays < 3){
          await this.accountPage.locator(nextMonthPath).click();
          await this.accountPage.waitForTimeout(250);
          avaliableDates = this.accountPage.locator(datePath);
        }
        await avaliableDates.nth(2).click();
      }
      else {
        console.error();
      }
    }

    protected async pressRepeatedly(buttonPath:string, confirmationPath:string | null):Promise<void> {
        const buttonLocator = this.accountPage?.locator(buttonPath);
        while(!(await buttonLocator?.isDisabled())){
            await buttonLocator?.click();
            if(confirmationPath !== null) {
                await this.accountPage?.waitForTimeout(2000);
                await this.accountPage?.locator(confirmationPath).click();
            }
            await this.accountPage?.waitForTimeout(2000);
        }
    }
  
  
    public async InitializePatient(firstName:string, lastName:string) {
      this.patientFirstName = firstName;
      this.patientLastName = lastName;
      this.patientFullName = this.patientFirstName + " " + this.patientLastName;
    }
  
    public async CurveLogin(username:string):Promise<void> {
      if (this.accountPage === null) {
        console.error('Account page is null...');
      }
      else {
        await this.accountPage.goto('https://stagingcurve.medullallc.com/');
        await this.accountPage.waitForTimeout(2000);
        await expect(this.accountPage).toHaveURL(/.*login\.microsoftonline\.com*/);
        await this.accountPage.getByLabel('Enter your email, phone, or').fill(username);
        await this.accountPage.getByLabel('Enter your email, phone, or').press('Enter');
        await this.accountPage.waitForTimeout(1000);
        await expect(this.accountPage).toHaveURL(/.*medulla\.okta\.com*/);
        await this.accountPage.getByRole('button', { name: 'Next' }).click();
        await this.accountPage.getByLabel('Password').fill('Welcome4$'); // Update if password changes
        await this.accountPage.getByLabel('Password').press('Enter');
        await this.accountPage.getByRole('button', { name: 'No' }).click();
        await this.accountPage.waitForTimeout(2000);
        await expect(this.accountPage).toHaveURL(/.*stagingcurve\.medullallc\.com*/);
      }
    }
  
    // Clinic
    public async ClinicNewPatient():Promise<void> {
      if (this.accountPage === null) {
        console.error('Account page is null.');
      }
      else {
        // Form navigation
        await this.accountPage.reload();
        await this.accountPage.waitForTimeout(5000);
        await this.accountPage.getByRole('button', { name: 'New verification request' }).click();
        await this.accountPage.waitForTimeout(3000);
    
        // 1) Enter Request Details
        await this.accountPage.getByLabel('Patient Type *').locator('span').click();      
        await this.accountPage.waitForTimeout(500);
        await this.accountPage.getByRole('option', { name: 'Create New' }).locator('span').click();
        await this.accountPage.waitForTimeout(1000);
        await this.accountPage.getByLabel('Payor Type *').locator('span').click();
        await this.accountPage.waitForTimeout(500);
        await this.accountPage.getByRole('option', { name: 'Health Insurance' }).locator('span').click();
        await this.accountPage.waitForTimeout(1000);
        await this.accountPage.getByLabel('Verification Reason *').locator('span').click();
        await this.accountPage.waitForTimeout(500);
        await this.accountPage.getByRole('option', { name: 'New Care Plan' }).click();
        await this.accountPage.waitForTimeout(1000);
        await this.accountPage.locator('mat-select[formControlName="docLastName"]').click();
        await this.accountPage.waitForTimeout(500);
        await this.accountPage.locator('mat-option.mat-option').nth(0).click();
        await this.accountPage.waitForTimeout(1000);
    
        // 2) Enter Patient Details
        await this.accountPage.getByLabel('First Name *').fill(this.patientFirstName);
        await this.accountPage.getByLabel('Last Name *', { exact: true }).fill(this.patientLastName);
        await this.accountPage.getByLabel('Date of Birth *').fill('12/12/1999');
        // Calendar
        await this.dateSelector('button[aria-label="Open calendar"]', 'button[aria-label="Next month"]', 'button.mat-calendar-body-cell:not(.mat-calendar-body-disabled)');
        await this.accountPage.waitForTimeout(500);
        await this.accountPage.locator('div#report-time > mat-form-field > div.mat-form-field-wrapper > div.mat-form-field-flex > div.mat-form-field-infix > mat-select').click();
        await this.accountPage.waitForTimeout(1000);
        await this.accountPage.locator('mat-option.mat-option').nth(0).click();
        await this.accountPage.waitForTimeout(250);
        await this.accountPage.getByPlaceholder('Insurance Carrier').click();
        await this.accountPage.waitForTimeout(250);
        await this.accountPage.getByRole('option', { name: 'BCBS' }).locator('span').first().click();
        await this.accountPage.waitForTimeout(250);
        await this.accountPage.getByLabel('Carrier Plan').locator('span').click();
        await this.accountPage.waitForTimeout(250);
        await this.accountPage.getByText('PPO').click();
        await this.accountPage.waitForTimeout(500);
  
    
        // 3) Working Recommendations
        await this.accountPage.getByLabel('Dx Code 1 *').fill('12345');
        await this.accountPage.getByLabel('Dx Code 2 *').fill('12345');
        await this.accountPage.getByLabel('Dx Code 3 *').fill('12345');
        await this.accountPage.getByText('SelectSeverity *').click();
        await this.accountPage.getByText('Mild Condition (VAS 1-3)').click();
        await this.accountPage.getByText('SelectOnset *').click();
        await this.accountPage.getByText('Acute (<6 weeks)').click();
        await this.accountPage.getByText('SelectComplicating Factors *').click();
        await this.accountPage.getByRole('option', { name: 'Yes' }).locator('span').click();
        await this.accountPage.getByText('SelectRegions of Concerns *').click();
        await this.accountPage.getByText('1-2 Regions', { exact: true }).click();
        await this.accountPage.getByRole('button', { name: 'Quick Fill' }).click();
        await this.accountPage.getByRole('menuitem', { name: '36 visits (Initial Care)' }).click();
    
        await this.accountPage.locator('#mat-checkbox-6 > .mat-checkbox-layout > .mat-checkbox-inner-container').click();
    
        // 4) Paperwork
        await this.accountPage.getByRole('button', { name: 'PAPERWORK' }).click();
        await this.accountPage.waitForTimeout(500);
        await this.accountPage.locator('#upload-btn').setInputFiles(testfilePath);
    
        await this.accountPage.getByRole('button', { name: 'SUBMIT' }).click();
    
        // Loggin Out
        // await clinicPage.getByRole('button', { name: 'Account' }).click();
        // await clinicPage.getByRole('menuitem', { name: 'Logout' }).click();
        // await clinicPage.locator('[data-test-id="monika\\.clinics_all\\@chiroone\\.net"]').click();
        
        await this.accountPage.waitForTimeout(2000);
      }
    }
  
    // RCM
    public async RCMVerification():Promise<void> {
      if (this.accountPage === null || this.accountContext === null) {
        console.error();
      }
      else{
  
        // Verification Queue Navigation using Patient Name
        await this.accountPage.reload();
        await this.accountPage.waitForTimeout(1000);
        await this.accountPage.getByRole('button', { name: 'go to verification queue' }).click();
        await this.accountPage.waitForTimeout(3000);
        await this.accountPage.getByRole('textbox', { name: 'Search for Task ID, First' }).fill(this.patientFullName);
        await this.accountPage.waitForTimeout(2000);
        await this.accountPage.getByRole('textbox', { name: 'Search for Task ID, First' }).press('Enter');
        await this.accountPage.waitForTimeout(5000);
  
        this.taskID = await this.accountPage.locator('#link').textContent();
        console.log(this.taskID);
        await this.accountPage.locator('#link').nth(0).click();
      
        // Assign Doctor to Patient
        await this.accountPage.getByRole('button', { name: 'Take Action arrow_drop_down' }).click();
        await this.accountPage.getByRole('menuitem', { name: 'Assign' }).click();
        await this.accountPage.getByText('UnassignedAssigned To *').click();
        await this.accountPage.locator('span.mat-option-text').nth(0).click();
        await this.accountPage.getByRole('button', { name: 'ASSIGN' }).click();
        await this.accountPage.waitForTimeout(3000);
  
        // Verification Queue Navigation using Task ID
        await this.accountPage.getByRole('textbox', { name: 'Search for Task ID, First' }).fill(this.taskID as string);
        await this.accountPage.getByRole('textbox', { name: 'Search for Task ID, First' }).press('Enter');
        await this.accountPage.locator('#link').nth(0).click();
        await this.accountPage.waitForTimeout(1000);
      
        // Review Request
        this.accountContext.on('page', newPage => { this.additionalPages.push(newPage) }); 
        await this.accountPage.getByRole('button', { name: 'OPEN ALL open_in_new' }).click();
        await this.accountPage.waitForTimeout(3000);
        for (const newPage of this.additionalPages) {
          await newPage.close();
        }
        await this.accountPage.getByRole('button', { name: 'continue arrow_forward' }).click();
  
        // Select IV Template
        await this.accountPage.getByLabel('Search Templates').click();
        await this.accountPage.waitForTimeout(1000);
        await this.accountPage.getByRole('option', { name: 'CTY BCBSIL IN NETWORK' }).locator('span').first().click();
        await this.accountPage.waitForTimeout(1000);
        await this.accountPage.getByRole('button', { name: 'continue arrow_forward' }).click();
        await this.accountPage.waitForTimeout(3000);
  
        // Insurance Verification
        await this.accountPage.getByLabel('Reference Number *').fill('12345');
        await this.accountPage.getByLabel('Name of Insurance Rep *').fill('name');
        await this.accountPage.getByLabel('Select').locator('div').first().click();
        await this.accountPage.waitForTimeout(1000);
        await this.accountPage.getByText('Self').click();
        await this.accountPage.waitForTimeout(1000);
        await this.accountPage.getByLabel('Insurance Policy/ID Number *').fill('12345');
        await this.accountPage.getByLabel('Group Number *').fill('12345');
        await this.accountPage.getByLabel('Open calendar').click();
        await this.accountPage.locator('button.mat-calendar-body-cell').nth(0).click();
        await this.accountPage.waitForTimeout(1000);
        await this.accountPage.getByRole('button', { name: 'save changes save' }).click();
        await this.accountPage.waitForTimeout(3000);
        await this.accountPage.getByRole('button', { name: 'continue arrow_forward' }).click();
      
        // Care Recommendations
        await this.accountPage.waitForTimeout(5000);
        await this.accountPage.locator('div').filter({ hasText: /^Primary Fee Schedule \*$/ }).nth(2).click();
        await this.accountPage.waitForTimeout(2000);
        await this.accountPage.locator('span.mat-option-text').nth(0).click();
        await this.accountPage.waitForTimeout(1000);
        await this.accountPage.getByRole('button', { name: 'CALCULATE' }).click();
        await this.accountPage.waitForTimeout(1000);
        await this.accountPage.getByRole('button', { name: 'SUBMIT TO CLINIC' }).click();
  
        // Log Out
        // await RCMPage.getByRole('button', { name: 'Account' }).click();
        // await RCMPage.getByRole('menuitem', { name: 'Logout' }).click();
        // await RCMPage.locator('[data-test-id="rctmgr1\\@chiroone\\.net"]').click();
      }
    }
  
    // Clinic
    public async CarePlan():Promise<void> {
      if (this.accountPage === null) {
        console.error();
      }
      else{
        // Reload Page and Navigate to Task
        await this.accountPage.reload();
        await this.accountPage.waitForTimeout(3000);
        await this.accountPage.getByRole('textbox', { name: 'Search for Task ID, First' }).fill(this.patientFullName); //use patient name or task ID
        await this.accountPage.getByRole('textbox', { name: 'Search for Task ID, First' }).press('Enter');
        await this.accountPage.locator('#link').nth(0).click();
  
        // Review Request
        let repeat:boolean = true;
        while(repeat){
            await this.accountPage.locator('button').filter({ hasText: 'edit' }).click();
            await this.accountPage.locator('input.mat-input-element ').first().fill(this.patientFirstName + "1"); //add first_name
            await this.accountPage.waitForTimeout(1500);
            await this.accountPage.locator('button').filter({ hasText: /^save$/ }).click();
            await this.accountPage.waitForTimeout(1500);
            await this.accountPage.getByRole('button', { name: 'Save Changes' }).click();
            await this.accountPage.waitForTimeout(3000);
            if(await this.accountPage.locator('custom-button.save-changes-btn > div.co-theme > button').isDisabled()){
                repeat = false;
            }
            else{
                await this.accountPage.reload();
            }
        }
        // await this.accountPage.waitForTimeout(1500);
        // await this.accountPage.locator('button').filter({ hasText: 'edit' }).click();
        // await this.accountPage.locator('input.mat-input-element ').first().fill(this.patientFullName + "1"); //add first_name
        // await this.accountPage.waitForTimeout(1500);
        // await this.accountPage.locator('button').filter({ hasText: /^save$/ }).click();
        // await this.accountPage.waitForTimeout(1500);
        // await this.accountPage.getByRole('button', { name: 'Save Changes' }).click();
        // await this.accountPage.waitForTimeout(3000);
        //await this.pressRepeatedly('custom-button[maticon="arrow_forward"] > div.co-theme > button', 'div.content > div.mat-dialog-actions > custom-button.dialog-btn:nth-child(2) > div.co-theme > button');
        //await this.pressRepeatedly('custom-button.save-changes-btn > div.co-theme > button', 'div.content > div.mat-dialog-actions > custom-button.dialog-btn:nth-child(2) > div.co-theme > button');
        await this.accountPage.waitForTimeout(1500);
        
        await this.accountPage.getByRole('button', { name: 'continue arrow_forward' }).click();
        await this.accountPage.waitForTimeout(1500);
  
        // Insurance Verification 
        await this.accountPage.getByRole('button', { name: 'continue arrow_forward' }).click();
        await this.accountPage.waitForTimeout(2000);
  
        // Care Recommendations
        await this.accountPage.locator('tr:nth-child(28) > td:nth-child(3) > .mat-form-field > .mat-form-field-wrapper > .mat-form-field-flex > .mat-form-field-infix > input.mat-input-element').fill('1');
        await this.accountPage.getByRole('button', { name: 'CALCULATE' }).click();
        await this.accountPage.getByRole('button', { name: 'continue arrow_forward' }).click();
  
        // Patient Review
        await this.accountPage.locator('.mat-slide-toggle-bar').first().click();
        await this.accountPage.waitForTimeout(1000);
        await this.accountPage.locator('.mat-slide-toggle-bar').first().click();
        await this.accountPage.waitForTimeout(1000);
        await this.accountPage.getByText('print').click();
        await this.accountPage.waitForTimeout(500);
        await this.accountPage.locator('div').filter({ hasText: /^close$/ }).click();
        await this.accountPage.getByLabel('Patient Total').fill('1000.00');
        await this.accountPage.getByRole('button', { name: 'CALCULATE' }).click();
        await this.accountPage.waitForTimeout(1000);
        await this.accountPage.getByText('refresh').click();
        await this.accountPage.waitForTimeout(1000);
        await this.accountPage.locator('div.payments-tiles > div.ng-star-inserted:nth-child(2) > div.tile').click();
        await this.accountPage.waitForTimeout(1000);
        await this.accountPage.locator('div.ng-star-inserted').nth(1).click();
        await this.accountPage.waitForTimeout(1000);
        await this.dateSelector('div.payment-row:nth-child(2) > div.date-input > mat-form-field > div.mat-form-field-wrapper > div.mat-form-field-flex > div.mat-form-field-suffix > mat-datepicker-toggle > button', 'button.mat-calendar-next-button', 'button.mat-calendar-body-cell:not(.mat-calendar-body-disabled)');
        await this.accountPage.waitForTimeout(1000);
        await this.accountPage.getByText('Non-Credit Card').click();
        await this.accountPage.waitForTimeout(1000);
        await this.accountPage.getByRole('button', { name: 'GENERATE CPA' }).click();
        await this.accountPage.waitForTimeout(1000);
        await this.accountPage.locator('div').filter({ hasText: /^close$/ }).click();
        await this.accountPage.waitForTimeout(1000);
        await this.accountPage.getByRole('button', { name: 'Continue' }).click();
        await this.accountPage.waitForTimeout(2000);
      
        // ROF Outcome
        await this.accountPage.getByLabel('Select').click();
        await this.accountPage.waitForTimeout(1000);
        await this.accountPage.getByText('Care Plan', { exact: true }).click();
        await this.accountPage.waitForTimeout(1000);
        await this.accountPage.getByLabel('Open calendar').click();
        await this.accountPage.waitForTimeout(1000);
        await this.accountPage.locator('button.mat-calendar-body-cell:not(.mat-calendar-body-disabled)').nth(1).click();
        await this.accountPage.waitForTimeout(1000);
        await this.accountPage.locator('#upload-btn').setInputFiles(testfilePath);
        await this.accountPage.waitForTimeout(500);
        await this.accountPage.getByRole('button', { name: 'UPDATE RCM' }).click();
        await this.accountPage.waitForTimeout(1000);
      
      }
  
    }
  
    // Data Entry
    public async DataEntry():Promise<void> {
      if(this.accountPage === null) {
        console.error();
      }
      else{
        await this.accountPage.reload();
        await this.accountPage.getByRole('textbox', { name: 'Search for Task ID, First' }).fill(this.patientFullName as string); //name
        await this.accountPage.waitForTimeout(500);
        await this.accountPage.getByRole('textbox', { name: 'Search for Task ID, First' }).press('Enter');
        await this.accountPage.waitForTimeout(1000);
        await this.accountPage.locator('tr.mat-row').first().click();
        await this.accountPage.waitForTimeout(1500);
        await this.accountPage.getByRole('button', { name: 'Continue arrow_forward' }).click();
        await this.accountPage.waitForTimeout(1500);
        await this.accountPage.locator('.mat-checkbox-inner-container').click();
        await this.accountPage.waitForTimeout(500);
        await this.accountPage.getByRole('button', { name: 'Continue arrow_forward' }).click();
        await this.accountPage.waitForTimeout(1500);
        await this.accountPage.locator('.mat-checkbox-inner-container').click();
        await this.accountPage.waitForTimeout(500);
        await this.accountPage.getByRole('button', { name: 'Continue arrow_forward' }).click();
        await this.accountPage.waitForTimeout(1500);
        await this.accountPage.locator('.mat-checkbox-inner-container').click();
        await this.accountPage.waitForTimeout(500);
        await this.accountPage.getByRole('button', { name: 'Complete arrow_forward' }).click();
        await expect(this.accountPage).toHaveURL(/.*\/data-entry-queue/);
      }
    }
  
  
  }