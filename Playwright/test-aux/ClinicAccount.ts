import { test, expect, Browser, BrowserContext, Page } from '@playwright/test';
import {CurveAccount} from './CurveAccountClass';
const testfilePath = '../Playwright/test.pdf';

export class ClinicAccount extends CurveAccount {  

    constructor() {
        super();
    }
  
    public async CurveLogin():Promise<void> {
        try {
            await this.curveLoginFunction();
        } catch (error) {
            await this.curveLoginFunction();
        }
    }

    // Will need to add ways to verify different types of existing patients

    public async SubmitVerificationRequest(newPatient:boolean):Promise<void> {
        if (this.accountPage === null) {
          console.error('Account page is null.');
        }
        else {
            // Form navigation
            try {
                await this.newVerificationRequest();   
            } catch (error) {
                await this.newVerificationRequest();

            }
        
            // Form filling
            try {
                await this.requestDetails(newPatient);            // 1) Enter Request Details
                await this.patientDetails(newPatient);            // 2) Enter Patient Details
                await this.workingRecommendations();        // 3) Working Recommendations
                await this.paperworkSubmission();           // 4) Paperwork
            } catch (error) {
                await this.accountPage.reload();
                await this.requestDetails(newPatient);
                await this.patientDetails(newPatient);
                await this.workingRecommendations();
                await this.paperworkSubmission();
            }
        }
    }




    public async ClinicCurrentPatient():Promise<void> {
        if (this.accountPage === null) {
          console.error('Account page is null.');
        }
        else {
            // Form navigation
            try {
                await this.newVerificationRequest();   
            } catch (error) {
                await this.accountPage.goto('https://stagingcurve.medullallc.com/');
                await this.newVerificationRequest();
            }
        
            // Form filling
            try {
                await this.requestDetails(false);            // 1) Enter Request Details
                await this.patientDetails(false);            // 2) Enter Patient Details
                await this.workingRecommendations();    // 3) Working Recommendations
                await this.paperworkSubmission();       // 4) Paperwork
            } catch (error) {
                await this.accountPage.reload();
                await this.requestDetails(false);
                await this.patientDetails(false);
                await this.workingRecommendations();
                await this.paperworkSubmission();
            }
        }
    }

    public async CarePlan():Promise<void> {
        if (this.accountPage === null) {
            console.error();
        }
        else{
            // Reload Page and Navigate to Task
            try {
                await this.taskNavigation();   
            } catch (error) {
                await this.accountPage.goto('https://stagingcurve.medullallc.com/request-queue');
                await this.taskNavigation();
            }
    
            // Review Request
            try {
                await this.reviewRequest();   
            } catch (error) {
                await this.accountPage.reload();
                await this.reviewRequest();
            }
    
            // Insurance Verification
            try {
                await this.insuranceVerification();   
            } catch (error) {
                await this.accountPage.reload();
                await this.insuranceVerification();
            }
    
            // Care Recommendations
            try {
                await this.careRecommendations();   
            } catch (error) {
                await this.accountPage.reload();
                await this.careRecommendations();
            }
    
            // Patient Review
            try {
                await this.patientReview();   
            } catch (error) {
                await this.accountPage.reload();
                await this.patientReview();
            }
        
            // ROF Outcome
            try {
                await this.ROFOutcome();   
            } catch (error) {
                await this.accountPage.reload();
                await this.ROFOutcome();
            }
        }
    }

    private async curveLoginFunction():Promise<void>{
        await super.CurveLogin('Monika.Clinics_All@chiroone.net');
    }

    private async newVerificationRequest():Promise<void> {
        if (this.accountPage === null) {
            console.error('Account page is null.');
        }
        else{
            await this.accountPage.goto('https://stagingcurve.medullallc.com/');
            await this.accountPage.waitForTimeout(5000);
            await this.accountPage.getByRole('button', { name: 'New verification request' }).click();
            await this.accountPage.waitForTimeout(3000);
        }
    }
    private async requestDetails(newPatient:boolean):Promise<void> {
        if (this.accountPage === null) {
            console.error('Account page is null.');
        }
        else{
            await this.accountPage.getByLabel('Patient Type *').locator('span').click();
            // await this.accountPage.locator('form-select-field[label="Patient Type"] > div > mat-form-field > div > div.mat-form-field-flex > div.mat-form-field-infix > mat-select').click();     
            await this.accountPage.waitForTimeout(1000);
            if(newPatient){
                await this.accountPage.locator('mat-option.mat-option').nth(0).click(); // New Patient
            }
            else{
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
            await this.accountPage.locator('mat-select[formControlName="docLastName"]').click();
            await this.accountPage.waitForTimeout(500);
            await this.accountPage.locator('mat-option.mat-option').nth(0).click();
            await this.accountPage.waitForTimeout(1000);
        }
    }
    private async patientDetails(newPatient:boolean):Promise<void> {
        if (this.accountPage === null) {
            console.error('Account page is null.');
        }
        else{
            if(newPatient){
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
            await this.dateSelector('button[aria-label="Open calendar"]', 'button[aria-label="Next month"]', 'button.mat-calendar-body-cell:not(.mat-calendar-body-disabled)');
            await this.accountPage.waitForTimeout(1000);
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
    private async paperworkSubmission():Promise<void> {
        if (this.accountPage === null) {
            console.error('Account page is null.');
        }
        else{
            await this.accountPage.getByRole('button', { name: 'PAPERWORK' }).click();
            await this.accountPage.waitForTimeout(500);
            await this.accountPage.locator('#upload-btn').setInputFiles(testfilePath);
            await this.accountPage.getByRole('button', { name: 'SUBMIT' }).click();
            await this.accountPage.waitForTimeout(5000);
            await expect(this.accountPage).toHaveURL(/request-queue/);
        }
    }

    private async taskNavigation():Promise<void> {
        if (this.accountPage === null) {
            console.error('Account page is null.');
        }
        else{
            await this.accountPage.reload();
            await this.accountPage.waitForTimeout(3000);
            await this.accountPage.getByRole('textbox', { name: 'Search for Task ID, First' }).fill(this.patientFullName); //use patient name or task ID
            await this.accountPage.getByRole('textbox', { name: 'Search for Task ID, First' }).press('Enter');
            await this.accountPage.locator('#link').last().click();
            await expect(this.accountPage).toHaveURL(/process=1/);
        }
    }

    private async reviewRequest():Promise<void> {
        if (this.accountPage === null) {
            console.error('Account page is null.');
        }
        else{
            await this.accountPage.locator('button').filter({ hasText: 'edit' }).click();
            await this.accountPage.locator('input.mat-input-element ').first().fill(this.patientFirstName + "1"); //add first_name
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

    private async careRecommendations():Promise<void> {
        if (this.accountPage === null) {
            console.error('Account page is null.');
        }
        else{
            await this.accountPage.locator('tr:nth-child(28) > td:nth-child(3) > .mat-form-field > .mat-form-field-wrapper > .mat-form-field-flex > .mat-form-field-infix > input.mat-input-element').fill('1');
            await this.accountPage.getByRole('button', { name: 'CALCULATE' }).click();
            await this.accountPage.getByRole('button', { name: 'continue arrow_forward' }).click();
            await this.accountPage.waitForTimeout(2000);
            await expect(this.accountPage).toHaveURL(/process=4/);
        }
    }

    private async patientReview():Promise<void> {
        if (this.accountPage === null) {
            console.error('Account page is null.');
        }
        else{
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
            await expect(this.accountPage).toHaveURL(/process=5/);
        }
    }

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
            await this.accountPage.locator('button.mat-calendar-body-cell:not(.mat-calendar-body-disabled)').nth(1).click();
            await this.accountPage.waitForTimeout(1000);
            await this.accountPage.locator('#upload-btn').setInputFiles(testfilePath);
            await this.accountPage.waitForTimeout(500);
            await this.accountPage.getByRole('button', { name: 'UPDATE RCM' }).click();
            await this.accountPage.waitForTimeout(1000);
            await expect(this.accountPage).toHaveURL(/.*stagingcurve\.medullallc\.com*/);
        }
    }
  }