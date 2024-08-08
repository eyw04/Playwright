import { test, expect, Browser, BrowserContext, Page } from '@playwright/test';
import {CurveAccount} from './CurveAccountClass';
import exp from 'constants';
const testfilePath = '../Sandbox/test.pdf';

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

    public async DataEntry():Promise<void> {
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
                await this.ledgerCheck();
            } catch (error) {
                await this.accountPage.reload();
                await this.ledgerCheck();
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
            await this.accountPage.locator('tr.mat-row').first().click();
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

    private async ledgerCheck():Promise<void>{
        if (this.accountPage === null) {
            console.error('Account page is null.');
        }
        else {
            await this.accountPage.locator('.mat-checkbox-inner-container').click();
            await this.accountPage.waitForTimeout(500);
            await this.accountPage.getByRole('button', { name: 'Continue arrow_forward' }).click();
            await this.accountPage.waitForTimeout(2000);
            await expect(this.accountPage).toHaveURL(/process=4/);
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