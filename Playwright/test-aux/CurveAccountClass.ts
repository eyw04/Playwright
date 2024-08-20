import { test, expect, Browser, BrowserContext, Page } from '@playwright/test';
const testfilePath = '../Playwright/test.pdf';

// General class for all accounts used in Curve
// Note: there are many variables/functions that are protected > means that child classes have direct access
export class CurveAccount {

    // Browser context, pages, patient info
    protected accountContext: BrowserContext | null = null;
    protected accountPage: Page | null = null;
    protected additionalPages:Page[] = [];
    protected patientFirstName:string = "";
    protected patientLastName:string = "";
    protected patientFullName:string = "";
    protected taskID:string | null = null;
  
    // Constructor is empty, need to initalize all member variables thorugh async functions
    constructor() {}
  
    // Assigns browser to account and opens new page
    public async InitializeContext(inputBrowser:Browser): Promise<void> {
      this.accountContext = await inputBrowser.newContext();
      this.accountPage = await this.accountContext.newPage();
    }

    // Assigns patient info to account
    public async InitializePatient(firstName:string, lastName:string) {
      this.patientFirstName = firstName;
      this.patientLastName = lastName;
      this.patientFullName = this.patientFirstName + " " + this.patientLastName;
    }
  
    // General curve login
    // Note: everytime we interact with a page, we need to check that it is not null
    public async CurveLogin(username:string):Promise<void> {
      if (this.accountPage === null) {
        console.error('Account page is null...');
      }
      else {
        await this.accountPage.goto('https://devcurve.medullallc.com/');
        await this.accountPage.waitForTimeout(2000);
        // await expect(this.accountPage).toHaveURL(/.*login\.microsoftonline\.com*/);
        // console.log(username);
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
  
    // Generalized calendar interaction
    // Clicks on calendar > goes to the next month if required > selects available dates
    // Utilizes CSS selectors, capable of filtering elements with unwanted tags/values 
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

    // Presses button/elemet repeatedly
    // Currently unused, but useful for buggy buttons when debugging test cases
    // Fun note: could be used as an auto-clicker
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
  
    // 
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


    
    // In case someone wants to convert protected to private, getters and setters defined here:

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
