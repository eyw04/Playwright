import { test, expect, Browser, BrowserContext, Page } from '@playwright/test';
const testfilePath = '../Playwright/test.pdf';

export class CurveAccount {
    protected accountContext: BrowserContext | null = null;
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
        if(numAvailableDays < 4){
          await this.accountPage.locator(nextMonthPath).click();
          await this.accountPage.waitForTimeout(250);
          avaliableDates = this.accountPage.locator(datePath);
        }
        await avaliableDates.nth(3).click();
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
        await this.accountPage.goto('https://devcurve.medullallc.com/');
        await this.accountPage.waitForTimeout(2000);
        // await expect(this.accountPage).toHaveURL(/.*login\.microsoftonline\.com*/);
        console.log(username);
        await this.accountPage.getByLabel('Enter your email, phone, or').fill(username);
        await this.accountPage.getByLabel('Enter your email, phone, or').press('Enter');
        await this.accountPage.waitForTimeout(1000);
        await expect(this.accountPage).toHaveURL(/.*medulla\.okta\.com*/);
        await this.accountPage.getByRole('button', { name: 'Next' }).click();
        await this.accountPage.getByLabel('Password').fill('Welcome4$'); // Update if password changes
        await this.accountPage.getByLabel('Password').press('Enter');
        await this.accountPage.getByRole('button', { name: 'No' }).click();
        await this.accountPage.waitForTimeout(2000);
        //await expect(this.accountPage).toHaveURL(/.*stagingcurve\.medullallc\.com*/);
      }
    }

    public async ClearPages():Promise<void> {
      if (this.accountPage === null) {
        console.error('Account page is null...');
      }
      else {
        this.accountPage.close();
      }
    }

    public GetTaskID():string {
      return this.taskID as string;
    }
    public SetTaskID(taskID:string) {
      this.taskID = taskID;
    }


    
    
    // public getAccountContext():BrowserContext {
    //     return this.accountContext as BrowserContext;
    // }
    // public getAccountPage():Page {
    //     return this.accountPage as Page;
    // }
    // public getPatientFirstName():string {
    //     return this.patientFirstName;
    // }
    // public getPatientLasttName():string {
    //     return this.patientLastName;
    // }
    // public getPatientFullName():string {
    //     return this.patientFullName;
    // }
    // public getTaskID():string {
    //     return this.taskID as string;
    // }
    // public setTaskID(taskID: string) {
    //     this.taskID = taskID;
    // }
    // public getAdditionalPages():Page[] {
    //     return this.additionalPages;
    // }
    // public setAdditionalPages(additionalPages:Page[]) {
    //     this.additionalPages = additionalPages;
    // }
  }
