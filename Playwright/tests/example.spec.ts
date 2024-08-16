import { test, expect, Browser, BrowserContext, Page } from '@playwright/test';
import { CurveAccount } from '../test-aux/CurveAccountClass';
import { ClinicAccount } from '../test-aux/ClinicAccount';
import { RCMAccount } from '../test-aux/RCMAccount';
import { DataEntryAccount } from '../test-aux/DataEntryAccount';
const testfilePath = '../Sandbox/test.pdf';

let Clinic:ClinicAccount = new ClinicAccount();
let RCM:RCMAccount = new RCMAccount();
let DataEntry:DataEntryAccount = new DataEntryAccount();



test.describe('End to End tests', () => {

  test.describe.configure({retries: 0});

  test.beforeAll(async({ browser }) => {
    await Clinic.initialize(browser);
    await RCM.initialize(browser);
    await DataEntry.initialize(browser);

    var login1 = Clinic.CurveLogin();
    var login2 = RCM.CurveLogin();
    var login3 = DataEntry.CurveLogin();

    await login1;
    await login2;
    await login3;
    
  });

  test.beforeEach(async() => {
    const patient_first_name:string = "testfirstname"; //let this be the test ID
    const patient_last_name:string = await genLastName();
    Clinic.InitializePatient(patient_first_name,patient_last_name);
    RCM.InitializePatient(patient_first_name,patient_last_name);
    DataEntry.InitializePatient(patient_first_name,patient_last_name);
  });
  
  test('test1', async ({}) => {
    await Clinic.SubmitVerificationRequest(true);
    await RCM.RCMVerification(true);
    await Clinic.CarePlan();
    await DataEntry.DataEntry();
  });

  test('test2', async ({}) => {
    const patient_first_name:string = "testfirstname1"; //let this be the test ID
    const patient_last_name:string = "20248169386";
    Clinic.InitializePatient(patient_first_name,patient_last_name);
    RCM.InitializePatient(patient_first_name,patient_last_name);
    DataEntry.InitializePatient(patient_first_name,patient_last_name);

    await Clinic.SubmitVerificationRequest(false);
    await RCM.RCMVerification(false);
    await Clinic.CarePlan();
    await DataEntry.DataEntry();
  });



  test.afterAll(async({ }) => {
    var clear1 = Clinic.ClearPages();
    var clear2 = RCM.ClearPages();
    var clear3 = DataEntry.ClearPages();

    await clear1;
    await clear2;
    await clear3;
    
  });


}); 

async function genLastName(): Promise<string> {
  const Date_Object = new Date();
  const name:string = "" + Date_Object.getFullYear() +  (Date_Object.getMonth()+1) + Date_Object.getDate() + Date_Object.getHours() + Date_Object.getMinutes() + Date_Object.getSeconds();
  console.log(name);
  return name;

}

