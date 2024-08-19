import { test, expect, Browser, BrowserContext, Page } from '@playwright/test';
import {CurveAccount} from './CurveAccountClass';
const testfilePath = '../Playwright/test.pdf';

export class DataEntryAccount extends CurveAccount {  

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
        await super.CurveLogin('Matt.Data@chiroone.net');
    }

    public async DataEntry(newPatient:boolean):Promise<void> {
        if(this.accountPage === null) {
          console.error();
        }
        else{
            // Navigating the Queue
            try {
                await this.queueNavigation();
            } catch (error) {
                await this.accountPage.reload();
                await this.queueNavigation();
            }

            // Review Request 
            try {
                await this.reviewRequest();
            } catch (error) {
                await this.accountPage.reload();
                await this.reviewRequest();
            }

            // Platinum Entry
            try {
                await this.platinumEntry();
            } catch (error) {
                await this.accountPage.reload();
                await this.platinumEntry();
            }

            // Ledger Check
            try {
                await this.ledgerCheck(newPatient);
            } catch (error) {
                await this.accountPage.reload();
                await this.ledgerCheck(newPatient);
            }

            if(!newPatient){
                return;
            }

            // Additional Services Check
            try {
                await this.addServicesCheck();
            } catch (error) {
                await this.accountPage.reload();
                await this.addServicesCheck();
            }
        }
      }
    
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