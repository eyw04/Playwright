import { test, expect, Browser, BrowserContext, Page } from '@playwright/test';
import {CurveAccount} from './CurveAccountClass';
const testfilePath = '../Playwright/test.pdf';

export class DataEntryAccount extends CurveAccount {  

    constructor() {
        super();
    }
  
    public async CurveLogin():Promise<void> {
        try {
            await super.CurveLogin('Matt.Data@chiroone.net');
        } catch (error) {
            await super.CurveLogin('Matt.Data@chiroone.net');
        }
    }

    // Fourth step in Curve workflow
    public async DataEntry(newPatient:boolean):Promise<void> {
        if(this.accountPage === null) {
          console.error();
        }
        else{
            // 1) Navigating the Queue
            try {
                await this.queueNavigation();
            } catch (error) {
                await this.accountPage.reload();
                await this.queueNavigation();
            }

            // 2) Review Request 
            try {
                await this.reviewRequest();
            } catch (error) {
                await this.accountPage.reload();
                await this.reviewRequest();
            }

            // 3) Platinum Entry
            try {
                await this.platinumEntry();
            } catch (error) {
                await this.accountPage.reload();
                await this.platinumEntry();
            }

            // 4) Ledger Check
            try {
                await this.ledgerCheck(newPatient);
            } catch (error) {
                await this.accountPage.reload();
                await this.ledgerCheck(newPatient);
            }

            // 4a) Existing Patients do not have additional services check
            if(!newPatient){
                return;
            }

            // 5) Additional Services Check
            try {
                await this.addServicesCheck();
            } catch (error) {
                await this.accountPage.reload();
                await this.addServicesCheck();
            }
        }
      }
    
    // 1st step of data entry
    private async queueNavigation():Promise<void>{
        if (this.accountPage === null) {
            console.error('Account page is null.');
        }
        else {
            await this.accountPage.reload();
            await this.accountPage.getByRole('textbox', { name: 'Search for Task ID, First' }).fill(this.patientFullName as string); //name
            await this.accountPage.waitForTimeout(500);
            await this.accountPage.getByRole('textbox', { name: 'Search for Task ID, First' }).press('Enter');
            await this.accountPage.waitForTimeout(1000);
            await this.accountPage.locator('tr.mat-row').last().click();
            await this.accountPage.waitForTimeout(2000);
            await expect(this.accountPage).toHaveURL(/process=1/);
        }
    }

    // 2nd step of data entry
    private async reviewRequest():Promise<void>{
        if (this.accountPage === null) {
            console.error('Account page is null.');
        }
        else {
            await this.accountPage.getByRole('button', { name: 'Continue arrow_forward' }).click();
            await this.accountPage.waitForTimeout(2000);
            await expect(this.accountPage).toHaveURL(/process=2/);
        }
    }

    // 3rd step of data entry
    private async platinumEntry():Promise<void>{
        if (this.accountPage === null) {
            console.error('Account page is null.');
        }
        else {
            await this.accountPage.locator('.mat-checkbox-inner-container').click();
            await this.accountPage.waitForTimeout(500);
            await this.accountPage.getByRole('button', { name: 'Continue arrow_forward' }).click();
            await this.accountPage.waitForTimeout(2000);
            await expect(this.accountPage).toHaveURL(/process=3/);
        }
    }

    // 4th step of data entry
    private async ledgerCheck(newPatient:boolean):Promise<void>{
        if (this.accountPage === null) {
            console.error('Account page is null.');
        }
        else {
            if(newPatient){
                await this.accountPage.locator('.mat-checkbox-inner-container').click();
                await this.accountPage.waitForTimeout(500);
                await this.accountPage.getByRole('button', { name: 'Continue arrow_forward' }).click();
                await this.accountPage.waitForTimeout(2000);
                await expect(this.accountPage).toHaveURL(/process=4/);
            }
            else{
                await this.accountPage.waitForTimeout(3000);
                // There are different types of ledger checks, this if statement captures both types
                if(this.accountPage.locator('li.row:nth-child(1) > div.prompt-checkbox-grouping > div.checkbox:nth-child(2) > mat-checkbox')){
                    await this.accountPage.locator('li.row:nth-child(1) > div.prompt-checkbox-grouping > div.checkbox:nth-child(2) > mat-checkbox').click();
                    await this.accountPage.waitForTimeout(500);
                    await this.accountPage.locator('li.row:nth-child(2) > div.prompt-checkbox-grouping > div.checkbox:nth-child(2) > mat-checkbox').click();
                    await this.accountPage.waitForTimeout(500);
                    await this.accountPage.locator('div.co-theme-checkbox > mat-checkbox').click();
                    await this.accountPage.waitForTimeout(500);
                    await this.accountPage.getByRole('button', { name: 'Complete arrow_forward' }).click();
                    await expect(this.accountPage).toHaveURL(/.*\/data-entry-queue/);
                }
                else{
                    await this.accountPage.locator('.mat-checkbox-inner-container').click();
                    await this.accountPage.waitForTimeout(500);
                    await this.accountPage.getByRole('button', { name: 'Continue arrow_forward' }).click();
                    await this.accountPage.waitForTimeout(2000);
                    await expect(this.accountPage).toHaveURL(/process=4/);
                }
            }
        }
    }

    // 5th step of data entry
    private async addServicesCheck():Promise<void>{
        if (this.accountPage === null) {
            console.error('Account page is null.');
        }
        else {
            await this.accountPage.locator('.mat-checkbox-inner-container').click();
            await this.accountPage.waitForTimeout(500);
            await this.accountPage.getByRole('button', { name: 'Complete arrow_forward' }).click();
            await this.accountPage.waitForTimeout(2000);
            await expect(this.accountPage).toHaveURL(/.*\/data-entry-queue/);
        }
    }
}