// Note: all public methods have a capitalized first letter: InitializeContext()
//    Protected and private methods have a lowercase first letter: dateSelector(), curveLoginFunction()
// Note: many function calls are encapulated in try-catch statements
//    Allows us to retry the page without through all of the code 

import { test, expect, Browser, BrowserContext, Page } from '@playwright/test';
import { CurveAccount } from '../test-aux/CurveAccountClass';
import { ClinicAccount } from '../test-aux/ClinicAccount';
import { RCMAccount } from '../test-aux/RCMAccount';
import { DataEntryAccount } from '../test-aux/DataEntryAccount';
const testfilePath = '../Sandbox/test.pdf'; // file pathing for test.pdf location


// Each account are children of a general Curve Account class
// Any general functionality used within Cuvre will be accesible in the parent class
// Contructors don't do anything (no await in constructors), all member variables should be initialized seperately
let Clinic:ClinicAccount = new ClinicAccount();
let RCM:RCMAccount = new RCMAccount();
let DataEntry:DataEntryAccount = new DataEntryAccount();


// There are a few settings configured in the test.describe function: # retries
// Additional seetings can be found in playwright.config: timeout (time limit for each test cases) and action timeout (time limit for each action)
// Note: we can test with additional browsers thorugh playwright.config > no change to code
// .serial means that the tests will be run sequentially, may want to change later for speed
test.describe.serial('End to End tests', () => {

  test.describe.configure({retries: 0});

  // Actions performed BEFORE ALL tests
  // Currently, initializes a new broswer context and logs in as respective user
  test.beforeAll(async({ browser }) => {
    await Clinic.InitializeContext(browser);
    await RCM.InitializeContext(browser);
    await DataEntry.InitializeContext(browser);

    var login1 = Clinic.CurveLogin();
    var login2 = RCM.CurveLogin();
    var login3 = DataEntry.CurveLogin();

    await login1;
    await login2;
    await login3;
  });

  // Actions performed BEFORE EACH tests
  // Generates and initializes patients to the accounts
  test.beforeEach(async() => {
    const patient_first_name:string = "testfirstname";
    const patient_last_name:string = await genLastName();
    Clinic.InitializePatient(patient_first_name,patient_last_name);
    RCM.InitializePatient(patient_first_name,patient_last_name);
    DataEntry.InitializePatient(patient_first_name,patient_last_name);
  });
  
  // End-to-end test with new patient
  // True's refer to the fact the the patient is a "new" patient 
  test('New Patient', async ({}) => {
    await Clinic.SubmitVerificationRequest(true); // 1) New patient verification request
    await RCM.RCMVerification(true);              // 2) RCM verification
    Clinic.SetTaskID(RCM.GetTaskID());            // Clinic gets the task ID from RCM, used for navigation 
    await Clinic.CarePlan();                      // 3) Clinic assigns care plan
    await DataEntry.DataEntry(true);              // 4) Data entry confirmation
  });

  // End-to-end test with exisiting patient
  // False's refer to the fact the the patient is not a "new" patient
  // Currently, the existing patient is hardcoded as a patient that has been generated in a previous test > should run sequentially to test1
  test('Existing Patient', async ({}) => {
    const patient_first_name:string = "testfirstname1";
    const patient_last_name:string = "202481901838";
    Clinic.InitializePatient(patient_first_name,patient_last_name);
    RCM.InitializePatient(patient_first_name,patient_last_name);
    DataEntry.InitializePatient(patient_first_name,patient_last_name);

    await Clinic.SubmitVerificationRequest(false);  // 1) Existing patient verification request
    await RCM.RCMVerification(false);               // 2) RCM verification
    Clinic.SetTaskID(RCM.GetTaskID());              // Clinic gets the task ID from RCM, used for navigation 
    await Clinic.CarePlan();                        // 3) Clinic assigns care plan
    await DataEntry.DataEntry(false);               // 4) Data entry confirmation

  });


  // Actions performed AFTER ALL tests
  // Currently, clears all generated pages
  test.afterAll(async({ }) => {
    var clear1 = Clinic.ClearPages();
    var clear2 = RCM.ClearPages();
    var clear3 = DataEntry.ClearPages();

    await clear1;
    await clear2;
    await clear3;
    
  });


}); 

// Generates a last name using the current time
// Avoids naming overlap 
async function genLastName(): Promise<string> {
  const Date_Object = new Date();
  const name:string = "" + Date_Object.getFullYear() +  (Date_Object.getMonth()+1) + Date_Object.getDate() + Date_Object.getHours() + Date_Object.getMinutes() + Date_Object.getSeconds();
  console.log(name);
  return name;
}

