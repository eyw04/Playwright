import { test, expect, Browser, BrowserContext, Page } from '@playwright/test';
import {CurveAccount} from './CurveAccountClass';
const testfilePath = '../Playwright/test.pdf';

export class RCMAccount extends CurveAccount {  

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

    private async curveLoginFunction():Promise<void>{
        await super.CurveLogin('RCTMgr1@chiroone.net');
    }

    // RCM
    public async RCMVerification(newPatient:boolean):Promise<void> {
        if (this.accountPage === null || this.accountContext === null) {
            console.error();
        }
        else{

            // Verification Queue Navigation using Patient Name
            try {
                await this.queueNavigationName();
            } catch (error) {
                await this.accountPage.goto('https://stagingcurve.medullallc.com/');
                await this.queueNavigationName();
            }

            // Assign Doctor to Patient
            try {
                await this.assignDoctor();
            } catch (error) {
                await this.accountPage.reload();
                await this.assignDoctor();
            }

            // Verification Queue Navigation using Task ID
            try {
                await this.queueNavigationID();
            } catch (error) {
                await this.accountPage.reload();
                await this.queueNavigationID();
            }

            // Review Request
            try {
                await this.reviewRequest();
            } catch (error) {
                await this.accountPage.reload();
                await this.reviewRequest();
            }

            // Select IV Template
            try {
                await this.selectIVTemplate();
            } catch (error) {
                await this.accountPage.reload();
                await this.selectIVTemplate();
            }

            // Insurance Verification
            try {
                await this.insuranceVerification();
            } catch (error) {
                await this.accountPage.reload();
                await this.insuranceVerification();
            }

            if(!newPatient){
                try {
                    await this.checkClaimsStatus();
                } catch (error) {
                    await this.accountPage.reload();
                    await this.checkClaimsStatus();
                }
                
            }

            // Care Recommendations
            try {
                await this.CareRecommendations();
            } catch (error) {
                await this.accountPage.reload();
                await this.CareRecommendations();
            }
        }
    }
    
    
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
    private async assignDoctor():Promise<void>{
        if (this.accountPage === null) {
            console.error('Account page is null.');
        }
        else {
            await this.accountPage.getByRole('button', { name: 'Take Action arrow_drop_down' }).click();
            await this.accountPage.getByRole('menuitem', { name: 'Assign' }).click();
            await this.accountPage.getByText('UnassignedAssigned To *').click();
            await this.accountPage.locator('span.mat-option-text').nth(0).click();
            await this.accountPage.getByRole('button', { name: 'ASSIGN' }).click();
            await this.accountPage.waitForTimeout(3000);
            await expect(this.accountPage).toHaveURL(/request-queue/);
        }
    }
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
    private async insuranceVerification():Promise<void>{
        if (this.accountPage === null) {
            console.error('Account page is null.');
        }
        else {
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
    private async checkClaimsStatus():Promise<void>{
        if (this.accountPage === null) {
            console.error('Account page is null.');
        }
        else {
            await this.accountPage.locator('.mat-checkbox-inner-container').click();
            await this.accountPage.waitForTimeout(3000);
            await this.accountPage.getByRole('button', { name: 'continue arrow_forward' }).click();
            await expect(this.accountPage).toHaveURL(/process=5/);
        }
    }



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