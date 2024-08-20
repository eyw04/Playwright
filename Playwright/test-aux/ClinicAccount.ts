import { test, expect, Browser, BrowserContext, Page } from '@playwright/test';
import {CurveAccount} from './CurveAccountClass';
const testfilePath = '../Playwright/test.pdf';


// Class for the clinic account
export class ClinicAccount extends CurveAccount {  

    // Contructor calls parent constructor, which also does nothing
    constructor() {
        super();
    }
  
    // Logs into Curve as Monika Clinics
    // Calls the parent CurveLogin function
    public async CurveLogin():Promise<void> {
        try {
            await super.CurveLogin('Monika.Clinics_All@chiroone.net');
        } catch (error) {
            await super.CurveLogin('Monika.Clinics_All@chiroone.net');
        }
    }

    // First step in Curve workflow
    public async SubmitVerificationRequest(isNewPatient:boolean):Promise<void> {
        if (this.accountPage === null) {
          console.error('Account page is null.');
        }
        else {
            // Navigating to a new verification request form
            try {
                await this.newVerificationRequest();   
            } catch (error) {
                await this.accountPage.goto('https://devcurve.medullallc.com/');
                await this.newVerificationRequest();

            }
        
            // Form filling
            try {
                await this.requestDetails(isNewPatient);            // 1) Enter request details
                await this.patientDetails(isNewPatient);            // 2) Enter patient details
                await this.workingRecommendations();                // 3) Working recommendations
                await this.paperworkSubmission();                   // 4) Paperwork
            } catch (error) {
                await this.accountPage.reload();                    // Retry with page reload
                await this.requestDetails(isNewPatient);
                await this.patientDetails(isNewPatient);
                await this.workingRecommendations();
                await this.paperworkSubmission();
            }
        }
    }

    // Third step in Curve workflow
    // Note: try-catch statements are immplemented here for testing robustness
    public async CarePlan():Promise<void> {
        if (this.accountPage === null) {
            console.error();
        }
        else{
            // 1) Navigation to task
            try {
                await this.taskNavigation();
            } catch (error) {
                await this.accountPage.goto('https://devcurve.medullallc.com/request-queue');
                await this.taskNavigation();
            }
    
            // 2) Review Request
            try {
                await this.reviewRequest();   
            } catch (error) {
                await this.accountPage.reload();
                await this.reviewRequest();
            }
    
            // 3) Insurance Verification
            try {
                await this.insuranceVerification();   
            } catch (error) {
                await this.accountPage.reload();
                await this.insuranceVerification();
            }
    
            // 4) Care Recommendations
            try {
                await this.careRecommendations();   
            } catch (error) {
                await this.accountPage.reload();
                await this.careRecommendations();
            }
    
            // 5) Patient Review
            try {
                await this.patientReview();   
            } catch (error) {
                await this.accountPage.reload();
                await this.patientReview();
            }
        
            // 6) ROF Outcome
            try {
                await this.ROFOutcome();   
            } catch (error) {
                await this.accountPage.reload();
                await this.ROFOutcome();
            }
        }
    }

    // From home page > new verification request
    private async newVerificationRequest():Promise<void> {
        if (this.accountPage === null) {
            console.error('Account page is null.');
        }
        else{
            await this.accountPage.goto('https://devcurve.medullallc.com/');
            await this.accountPage.waitForTimeout(5000);
            await this.accountPage.getByRole('button', { name: 'New verification request' }).click();
            await this.accountPage.waitForTimeout(3000);
        }
    }

    // 1st step of new verification request form
    // Assumes that location will be automatically filled
    private async requestDetails(isNewPatient:boolean):Promise<void> {
        if (this.accountPage === null) {
            console.error('Account page is null.');
        }
        else{
            await this.accountPage.getByLabel('Patient Type *').locator('span').click();
            await this.accountPage.waitForTimeout(1000);
            if (isNewPatient) {
                await this.accountPage.locator('mat-option.mat-option').nth(0).click(); // New Patient
            }
            else {
                await this.accountPage.locator('mat-option.mat-option').nth(1).click(); // Existing Patient
            }
            await this.accountPage.waitForTimeout(1000);
            await this.accountPage.getByLabel('Payor Type *').locator('span').click();
            await this.accountPage.waitForTimeout(500);
            await this.accountPage.getByRole('option', { name: 'Health Insurance' }).locator('span').click();
            await this.accountPage.waitForTimeout(1000);
            await this.accountPage.getByLabel('Verification Reason *').locator('span').click();
            await this.accountPage.waitForTimeout(500);
            await this.accountPage.getByRole('option', { name: 'New Care Plan' }).click();
            await this.accountPage.waitForTimeout(1000);
            await this.accountPage.locator('mat-select[formControlName="docLastName"]').click(); // Doctor select
            await this.accountPage.waitForTimeout(500);
            await this.accountPage.locator('mat-option.mat-option').nth(0).click(); // First option
            await this.accountPage.waitForTimeout(1000);
        }
    }

    // 2nd step of new verification request form
    private async patientDetails(isNewPatient:boolean):Promise<void> {
        if (this.accountPage === null) {
            console.error('Account page is null.');
        }
        else{
            if (isNewPatient) {
                await this.accountPage.getByLabel('First Name *').fill(this.patientFirstName);
                await this.accountPage.getByLabel('Last Name *', { exact: true }).fill(this.patientLastName);
                await this.accountPage.getByLabel('Date of Birth *').fill('12/12/1999');
            }
            else{
                await this.accountPage.getByLabel('Search by Last Name, First').fill(this.patientLastName + " " + this.patientFirstName);
                await this.accountPage.waitForTimeout(2000);
                await this.accountPage.locator('div[role="listbox"] > mat-option').first().click();
            }
            // Calendar
            // Note: function has hard-coded the # of days ahead that we are selecting: ie the 3rd avaiable day 
            await this.dateSelector('button[aria-label="Open calendar"]', 'button[aria-label="Next month"]', 'button.mat-calendar-body-cell:not(.mat-calendar-body-disabled)');
            await this.accountPage.waitForTimeout(1000);
            // Time selector
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
        }
    }

    // 3rd step of new verification request form
    private async workingRecommendations():Promise<void> {
        if (this.accountPage === null) {
            console.error('Account page is null.');
        }
        else{
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
        }
    }

    // 4th step of new verification request form
    private async paperworkSubmission():Promise<void> {
        if (this.accountPage === null) {
            console.error('Account page is null.');
        }
        else{
            await this.accountPage.getByRole('button', { name: 'PAPERWORK' }).click();
            await this.accountPage.waitForTimeout(500);
            await this.accountPage.locator('#upload-btn').setInputFiles(testfilePath); // Using the testfilePath to upload test.pdf
            await this.accountPage.getByRole('button', { name: 'SUBMIT' }).click();
            await this.accountPage.waitForTimeout(5000);
            await expect(this.accountPage).toHaveURL(/request-queue/);
        }
    }



    // 1st step of care plan
    private async taskNavigation():Promise<void> {
        if (this.accountPage === null) {
            console.error('Account page is null.');
        }
        else{
            await this.accountPage.reload();
            await this.accountPage.waitForTimeout(3000);
            await this.accountPage.getByRole('textbox', { name: 'Search for Task ID, First' }).fill(this.taskID as string); //use patient name or task ID
            await this.accountPage.waitForTimeout(3000);
            await this.accountPage.getByRole('textbox', { name: 'Search for Task ID, First' }).press('Enter');
            await this.accountPage.waitForTimeout(3000);
            await this.accountPage.locator('#link').last().click();
            await expect(this.accountPage).toHaveURL(/process=1/); // Checking that the page sucessfully navigates to the next step of the form
        }
    }

    // 2nd step of care plan
    private async reviewRequest():Promise<void> {
        if (this.accountPage === null) {
            console.error('Account page is null.');
        }
        else{
            await this.accountPage.locator('button').filter({ hasText: 'edit' }).click();
            await this.accountPage.locator('input.mat-input-element ').first().fill(this.patientFirstName + "1");
            await this.accountPage.waitForTimeout(1500);
            await this.accountPage.locator('button').filter({ hasText: /^save$/ }).click();
            await this.accountPage.waitForTimeout(1500);
            await this.accountPage.getByRole('button', { name: 'Save Changes' }).click();
            await this.accountPage.waitForTimeout(3000);
            await this.accountPage.getByRole('button', { name: 'continue arrow_forward' }).click();
            await this.accountPage.waitForTimeout(1500);
            await expect(this.accountPage).toHaveURL(/process=2/);
        }
    }

    // 3rd step of care plan
    private async insuranceVerification():Promise<void> {
        if (this.accountPage === null) {
            console.error('Account page is null.');
        }
        else{
            await this.accountPage.getByRole('button', { name: 'continue arrow_forward' }).click();
            await this.accountPage.waitForTimeout(2000);
            await expect(this.accountPage).toHaveURL(/process=3/);
        }
    }

    // 4th step of care plan
    private async careRecommendations():Promise<void> {
        if (this.accountPage === null) {
            console.error('Account page is null.');
        }
        else{
            // Good example for how CSS selector works > changes imaging
            await this.accountPage.locator('tr:nth-child(28) > td:nth-child(3) > .mat-form-field > .mat-form-field-wrapper > .mat-form-field-flex > .mat-form-field-infix > input.mat-input-element').fill('1');
            await this.accountPage.getByRole('button', { name: 'CALCULATE' }).click();
            await this.accountPage.getByRole('button', { name: 'continue arrow_forward' }).click();
            await this.accountPage.waitForTimeout(2000);
            await expect(this.accountPage).toHaveURL(/process=4/);
        }
    }

    // 5th step of care plan
    private async patientReview():Promise<void> {
        if (this.accountPage === null) {
            console.error('Account page is null.');
        }
        else{
            await this.accountPage.locator('.mat-slide-toggle-bar').first().click();
            await this.accountPage.waitForTimeout(1000);
            await this.accountPage.locator('.mat-slide-toggle-bar').first().click();
            await this.accountPage.waitForTimeout(1000);
            // Double checking that the insurance is on, errors will occur later on if not
            if (this.accountPage.locator('input.mat-slide-toggle-input[aria-checked="false"]')) {
                await this.accountPage.locator('.mat-slide-toggle-bar').first().click();
                await this.accountPage.waitForTimeout(1000);
            }
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
            // Used to be able to pay without Credit Card, maybe obsolete now
            // await this.accountPage.getByText('Non-Credit Card').click();
            // await this.accountPage.waitForTimeout(1000);
            await this.accountPage.getByRole('button', { name: 'GENERATE CPA' }).click();
            await this.accountPage.waitForTimeout(1000);
            await this.accountPage.locator('div').filter({ hasText: /^close$/ }).click();
            await this.accountPage.waitForTimeout(1000);
            await this.accountPage.getByRole('button', { name: 'Continue' }).click();
            await this.accountPage.waitForTimeout(2000);
            await expect(this.accountPage).toHaveURL(/process=5/);
        }
    }

    // 6th step of care plan
    private async ROFOutcome():Promise<void> {
        if (this.accountPage === null) {
            console.error('Account page is null.');
        }
        else{
            await this.accountPage.getByLabel('Select').click();
            await this.accountPage.waitForTimeout(1000);
            await this.accountPage.getByText('Care Plan', { exact: true }).click();
            await this.accountPage.waitForTimeout(1000);
            await this.accountPage.getByLabel('Open calendar').click();
            await this.accountPage.waitForTimeout(1000);
            // Good example of CSS selector filtering out elements that we don't want
            await this.accountPage.locator('button.mat-calendar-body-cell:not(.mat-calendar-body-disabled)').nth(1).click();
            await this.accountPage.waitForTimeout(1000);
            await this.accountPage.locator('#upload-btn').setInputFiles(testfilePath);
            await this.accountPage.waitForTimeout(500);
            await this.accountPage.getByRole('button', { name: 'UPDATE RCM' }).click();
            await this.accountPage.waitForTimeout(1000);
            //await expect(this.accountPage).toHaveURL(/.*stagingcurve\.medullallc\.com*/);
        }
    }
  }