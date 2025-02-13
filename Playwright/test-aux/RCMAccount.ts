import { test, expect, Browser, BrowserContext, Page } from '@playwright/test';
import {CurveAccount} from './CurveAccountClass';
const testfilePath = '../Playwright/test.pdf';


// Class for the RCM account
export class RCMAccount extends CurveAccount {  

    // Contructor calls parent constructor, which also does nothing
    constructor() {
        super();
    }
  
    // Logs into Curve as RCM Manager
    // Calls the parent CurveLogin function
    public async CurveLogin():Promise<void> {
        try {
            await super.CurveLogin('RCTMgr1@chiroone.net');
        } catch (error) {
            await super.CurveLogin('RCTMgr1@chiroone.net');
        }
    }

    // Second step in Curve workflow
    public async RCMVerification(newPatient:boolean):Promise<void> {
        if (this.accountPage === null || this.accountContext === null) {
            console.error();
        }
        else{

            // 1) Verification Queue Navigation using Patient Name
            try {
                await this.queueNavigationName();
            } catch (error) {
                await this.accountPage.goto('https://devcurve.medullallc.com/');
                await this.queueNavigationName();
            }

            // 2) Assign Doctor to Patient
            try {
                await this.assignDoctor(newPatient);
            } catch (error) {
                await this.accountPage.reload();
                await this.assignDoctor(newPatient);
            }

            // 3) Verification Queue Navigation using Task ID
            try {
                await this.queueNavigationID();
            } catch (error) {
                await this.accountPage.reload();
                await this.queueNavigationID();
            }

            // 4) Review Request
            try {
                await this.reviewRequest();
            } catch (error) {
                await this.accountPage.reload();
                await this.reviewRequest();
            }

            // 5) Select IV Template
            try {
                await this.selectIVTemplate();
            } catch (error) {
                await this.accountPage.reload();
                await this.selectIVTemplate();
            }

            // 6) Insurance Verification
            try {
                await this.insuranceVerification();
            } catch (error) {
                await this.accountPage.reload();
                await this.insuranceVerification();
            }

            // 6a) Existing patients will have a "check claims status" page
            if(!newPatient){
                try {
                    await this.checkClaimsStatus();
                } catch (error) {
                    await this.accountPage.reload();
                    await this.checkClaimsStatus();
                }
            }

            // 7) Care Recommendations
            try {
                await this.CareRecommendations();
            } catch (error) {
                await this.accountPage.reload();
                await this.CareRecommendations();
            }
        }
    }
    
    // 1st step of RCM verification
    private async queueNavigationName():Promise<void>{
        if (this.accountPage === null) {
            console.error('Account page is null.');
        }
        else {
            await this.accountPage.reload();
            await this.accountPage.waitForTimeout(1000);
            await this.accountPage.getByRole('button', { name: 'go to verification queue' }).click();
            await this.accountPage.getByRole('textbox', { name: 'Search for Task ID, First' }).fill(this.patientFullName);
            await this.accountPage.waitForTimeout(3000);
            await this.accountPage.waitForTimeout(2000);
            await this.accountPage.getByRole('textbox', { name: 'Search for Task ID, First' }).press('Enter');
            await this.accountPage.waitForTimeout(5000);

            // Newest request from existing patients show up last
            // Maybe problem if there are too many requests for a single page
            this.taskID = await this.accountPage.locator('#link').last().textContent();
            console.log(this.taskID);
            await this.accountPage.locator('#link').last().click();
            await expect(this.accountPage).toHaveURL(/process=1/);
        }
    }

    // 2nd step of RCM verification
    private async queueNavigationID():Promise<void>{
        if (this.accountPage === null) {
            console.error('Account page is null.');
        }
        else {
            await this.accountPage.getByRole('textbox', { name: 'Search for Task ID, First' }).fill(this.taskID as string);
            await this.accountPage.getByRole('textbox', { name: 'Search for Task ID, First' }).press('Enter');
            await this.accountPage.locator('#link').nth(0).click();
            await this.accountPage.waitForTimeout(1000);
            await expect(this.accountPage).toHaveURL(/process=1/);
        }
    }

    // 3rd step of RCM verification
    private async assignDoctor(newPatient:boolean):Promise<void>{
        if (this.accountPage === null) {
            console.error('Account page is null.');
        }
        else {
            await this.accountPage.getByRole('button', { name: 'Take Action arrow_drop_down' }).click();
            await this.accountPage.getByRole('menuitem', { name: 'Assign' }).click();
            await this.accountPage.locator('div.assigned-to-wrapper > mat-form-field > div > div.mat-form-field-flex > div > mat-select').click();
            if(newPatient){
                await this.accountPage.locator('span.mat-option-text').nth(0).click();
            }
            else{
                await this.accountPage.locator('mat-option[aria-disabled="false"]:not([aria-selectwed="true"])').nth(0).click();
            }
            await this.accountPage.getByRole('button', { name: 'ASSIGN' }).click();
            await this.accountPage.waitForTimeout(3000);
            await expect(this.accountPage).toHaveURL(/request-queue/);
        }
    }

    // 4th step of RCM verification
    private async reviewRequest():Promise<void>{
        if (this.accountPage === null || this.accountContext === null) {
            console.error('Account page is null.');
        }
        else {
            this.accountContext.on('page', newPage => { this.additionalPages.push(newPage) }); 
            await this.accountPage.getByRole('button', { name: 'OPEN ALL open_in_new' }).click();
            await this.accountPage.waitForTimeout(3000);
            for (const newPage of this.additionalPages) {
                await newPage.close();
            }
            await this.accountPage.getByRole('button', { name: 'continue arrow_forward' }).click();
            await expect(this.accountPage).toHaveURL(/process=2/);
        }
    }

    // 5th step of RCM verification
    private async selectIVTemplate():Promise<void>{
        if (this.accountPage === null) {
            console.error('Account page is null.');
        }
        else {
            await this.accountPage.getByLabel('Search Templates').click();
            await this.accountPage.waitForTimeout(1000);
            await this.accountPage.getByRole('option', { name: 'CTY BCBSIL IN NETWORK' }).locator('span').first().click();
            await this.accountPage.waitForTimeout(1000);
            await this.accountPage.getByRole('button', { name: 'continue arrow_forward' }).click();
            await this.accountPage.waitForTimeout(3000);
            await expect(this.accountPage).toHaveURL(/process=3/);
        }
    }

    // 6th step of RCM verification
    private async insuranceVerification():Promise<void>{
        if (this.accountPage === null) {
            console.error('Account page is null.');
        }
        else {
            // Note: sometimes selecting self clears the page > this needs to be done first
            await this.accountPage.getByLabel('Select').locator('div').first().click();
            await this.accountPage.getByText('Self').click();
            await this.accountPage.waitForTimeout(1000);
            await this.accountPage.getByLabel('Insurance Policy/ID Number *').fill('12345');
            await this.accountPage.getByLabel('Group Number *').fill('12345');
            await this.accountPage.getByLabel('Open calendar').click();
            await this.accountPage.locator('button.mat-calendar-body-cell').nth(0).click();
            await this.accountPage.waitForTimeout(1000);
            await this.accountPage.getByLabel('Reference Number *').fill('12345');
            await this.accountPage.getByLabel('Name of Insurance Rep *').fill('name');
            await this.accountPage.waitForTimeout(1000);
            await this.accountPage.getByRole('button', { name: 'save changes save' }).click();
            await this.accountPage.waitForTimeout(3000);
            await this.accountPage.getByRole('button', { name: 'continue arrow_forward' }).click();
            await expect(this.accountPage).toHaveURL(/process=4/);
        }
    }

    // 6a-th step of RCM verification
    private async checkClaimsStatus():Promise<void>{
        if (this.accountPage === null) {
            console.error('Account page is null.');
        }
        else {
            await this.accountPage.locator('.mat-checkbox-inner-container').first().click();
            await this.accountPage.waitForTimeout(1500);
            await this.accountPage.locator('mat-checkbox[formcontrolname="claimcheck"]').click();
            await this.accountPage.waitForTimeout(1500);
            await this.accountPage.getByRole('textbox').fill('testnote');
            await this.accountPage.waitForTimeout(1500);
            await this.accountPage.getByRole('button', { name: 'SEND TO CLAIMS' }).click();
            await this.accountPage.waitForTimeout(1500);
            await this.accountPage.getByRole('button', { name: 'continue arrow_forward' }).click();
            await expect(this.accountPage).toHaveURL(/process=5/);
        }
    }


    // 7th step of RCM verification
    private async CareRecommendations():Promise<void>{
        if (this.accountPage === null) {
            console.error('Account page is null.');
        }
        else {
            await this.accountPage.waitForTimeout(5000);
            await this.accountPage.locator('div').filter({ hasText: /^Primary Fee Schedule \*$/ }).nth(2).click();
            await this.accountPage.waitForTimeout(2000);
            await this.accountPage.locator('span.mat-option-text').nth(0).click();
            await this.accountPage.waitForTimeout(1000);
            await this.accountPage.getByRole('button', { name: 'CALCULATE' }).click();
            await this.accountPage.waitForTimeout(1000);
            await this.accountPage.getByRole('button', { name: 'SUBMIT TO CLINIC' }).click();
            await expect(this.accountPage).toHaveURL(/request-queue/);
        }
    }

}