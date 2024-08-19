/*
* This file enables Playwright client to connect to remote browsers.
* It should be placed in the same directory as playwright.config.ts.
*/

import { defineConfig } from '@playwright/test';
import config from './playwright.config';
let PLAYWRIGHT_SERVICE_ACCESS_TOKEN = "eyJhbGciOiJSUzI1NiIsImtpZCI6IjVlMjk4M2Q5NzZiOTRiYTNhYWI1MGNhMmU3ZGE2N2EwIiwidHlwIjoiSldUIn0.eyJhaWQiOiJlYXN0dXNfOTk2NGQ5YzMtMjQzOS00NDkzLTgyNDgtYjBmNGNhNzI0YTgwIiwic3ViIjoicGxheXdyaWdodHNlcnZpY2VhY2Nlc3NrZXkiLCJpZCI6ImI1M2MyMmQ5LTViOGUtNDUxMi05NDMwLTBhYmIyZjgxZTI1YyIsInNjb3BlIjoidGVzdGV4ZWN1dGlvbiIsInZlciI6IjEuMCIsInVzZXJOYW1lIjoiTmljaG9sYXMgTWNHdWlyZSIsImlzcyI6Imh0dHBzOi8vc3RzLndpbmRvd3MubmV0L2Y5YjU1YzQ4LTk2M2MtNDk5NS04OWMyLWQ1YTVjZDU4Y2I3ZC8iLCJhcHBpZCI6ImIxZmQ0ZWJmLTJiZWQtNDE2Mi1iZTg0LTk3ZTBmZTUyM2Y2NCIsImFwcGlkYWNyIjoiMCIsImdyb3VwcyI6WyIwYjc3MGEwZS1iMmM1LTQ4MTgtOGVkMS00MjBkNDJhNTIwYjciLCI4MDBhN2MyZi00ZGVlLTQ5NmUtYjdiYi0zZTRlZGZkMDRkZWUiLCJmZGZiYmU1Zi0zNmEyLTRiZmYtYmM5Yi00ZmEzYTliMDFhYTMiLCI5MjNkNWU5MS04OGRiLTRiZjUtOTQ3MS01NTdiNDZiZDdkNTYiLCIwMTViZWEwOS04NjM1LTRmNjAtYjQxZC01MjRmY2MwYzk4M2IiLCI0MWVkNWMxZi0xMTZiLTRiNjQtYTE2Ny1hNTBjYjRjMjE3MWQiLCJjNGQ0NDkyYS1lYTAyLTQ3ODctYjYwZS1lNGM4ZGUxNmUxYjQiLCJlOGM1ODIyYi00MjViLTQzN2EtOGQwZS01YmVkNDFiNTE3ZGMiLCIxN2YzMWUyZC0xMjQwLTQzMDAtOTJhYS03NzhlZTYyZDQ1NTciLCIxN2M2ZjgzNS05ZWU0LTQzOGItYWQ2My0xMWY5ZTQ1MDZlYzYiLCI5NzU2YjIzOS0xYzNiLTQ2ZGQtOGVkNC03NDczNDYxNzM2ODgiLCJjN2YzYzMzZS01ODMzLTQzYTEtYTAzNi1iODkxOGQ1MDQ0NzQiLCI5YWY1NjE0My04MTFkLTQyNjItYjk0Zi1hNWI2MDRmYzgxZDEiLCJhZTczNzc1MC1iYTBhLTRmODUtYWM4My00OGFlODliOTY5M2EiLCI1MGYxMmI1My02YjljLTQ5NzYtOTk5NC1lNGU0NjczMTE3YzUiLCJjMzBkNjA1NC01NDRiLTRiYWEtYjZiMy00ZTIwZDk5MzhmNWQiLCIwMjQ1NDU1Yi1iYjk1LTRiZWUtOTNlMS1mOTY2ZjRlYWViZTAiLCJlYzIxYzc1ZC01NjdkLTQzZDItYjc4MC05ZmJiOGNjMzg0MmEiLCI1NzJmZDQ3OS1lMmIyLTQ2Y2EtYjY4OC0xMWNlMWJiNmE5ZmIiLCI3ZTZjNmQ4Mi1kMGM5LTRiMTEtYTFkYi0xZjhjNGViYmU1NTkiLCJhYmVmMzA4Ni1iM2E4LTRkYzAtOTA4Mi0xNTJlZTk3NmFkOGEiLCJlYWQzMzA4YS1mMmYyLTQzMzgtYmNiOC0xYTBkNDI4Njk0NjkiLCJjMzcxMjI5OS04OWMzLTRmY2YtYjMwNS0wMTM0YjQ3NGYyYWUiLCI5Zjc5MmQ5OS0yZDVlLTRhYjQtOWI1ZS00Y2IwYzIxNDIyYzgiLCI0OGRhMjZhMy02YjFmLTQ0MTItODdiMy1hNTA1NDI5M2NhOTQiLCI3MWI1NjhhNy1lZjQ3LTRkYjgtYTFiOS05MzJmZjI0YjFlOWEiLCJhN2FiZmViOS04Y2IxLTQ5OGItYTQzMy0xOTk1YjBlNTcxNjEiLCI1ZWJiMzhjMy0zODUzLTQ5NTctOTczZi1iZTU1OWY0ZjIxZTMiLCI2MDFlMWNkZC1iNDIyLTQwNjktYWMzMi00ODRiNzRiMWNkNjIiLCIwOWIyNThkZS02YTY4LTRkNDItYTk1MC1jZTY4Nzg1NjFhNzciLCI0ZDFkMTFkZi0xMzc0LTRlNjgtOTI5OC1iOTM0MmRhNDM4MjEiLCIzNjNmOTRlYS03MTkzLTQ1ZWEtODdiNC04ZjZiMTY1ODE3YmQiLCI2YmJhNWJmNS03ZmQ2LTQ5YzItYWZlZi05MWRiNTk4ZWQ0M2IiXSwib2lkIjoiYmMyMWI3NTUtM2I5NS00YmUyLWIyYmQtY2VhOTljYTUzYWNjIiwicHVpZCI6IjEwMDMyMDAwNTBDQ0MyODciLCJzY3AiOiJ1c2VyX2ltcGVyc29uYXRpb24iLCJ0aWQiOiJmOWI1NWM0OC05NjNjLTQ5OTUtODljMi1kNWE1Y2Q1OGNiN2QiLCJ3aWRzIjpbImYyZWY5OTJjLTNhZmItNDZiOS1iN2NmLWExMjZlZTc0YzQ1MSIsImM0ZTM5YmQ5LTExMDAtNDZkMy04YzY1LWZiMTYwZGEwMDcxZiIsIjA1MjY3MTZiLTExM2QtNGMxNS1iMmM4LTY4ZTNjMjJiOWY4MCIsIjliODk1ZDkyLTJjZDMtNDRjNy05ZDAyLWE2YWMyZDVlYTVjMyIsImI3OWZiZjRkLTNlZjktNDY4OS04MTQzLTc2YjE5NGU4NTUwOSJdLCJuYmYiOjE3MjM4MjEyNTQsImV4cCI6MTcyNjQxMzI1MywiaWF0IjoxNzIzODIxMjU0fQ.VXPEK6sKe3ufVbiOqUCJn7KF-idSQBom7IFlaAj72s0RK3-nOJx-_x6mKm6v25PTP-fYknLqnvoL0QQ4QmH3wswKSOwDdeHjtdF0-78VWnxui7DyG-jI5mZ6adr8oSAyGoOvYduLen2n0EtVAbyveapg1-riBxv6m1r280JgMoNZ2pTf5mlu7yCsY1qeSMhJgSQ4rux_usHuhHBZgIyeEnnDXtJKMRP7I_S39o3q1TLTu3IBm43ItwibU_RgTVFqY3h2xJfEVfCggNJ2r_EJkSyqCu5f3cQdiew07LI4wRcBv1HlDOdCLPH9fQamx9eTff0jI994o2nbP0-xrI-dQA";
let PLAYWRIGHT_SERVICE_URL= "wss://eastus.api.playwright.microsoft.com/accounts/eastus_9964d9c3-2439-4493-8248-b0f4ca724a80/browsers";



// import dotenv from 'dotenv';

// Define environment on the dev box in .env file:
//  .env:
//    PLAYWRIGHT_SERVICE_ACCESS_TOKEN=XXX
//    PLAYWRIGHT_SERVICE_URL=XXX

// Define environment in your GitHub workflow spec.
//  env:
//    PLAYWRIGHT_SERVICE_ACCESS_TOKEN: ${{ secrets.PLAYWRIGHT_SERVICE_ACCESS_TOKEN }}
//    PLAYWRIGHT_SERVICE_URL: ${{ secrets.PLAYWRIGHT_SERVICE_URL }}
//    PLAYWRIGHT_SERVICE_RUN_ID: ${{ github.run_id }}-${{ github.run_attempt }}-${{ github.sha }}

// dotenv.config();

// Name the test run if it's not named yet.
process.env.PLAYWRIGHT_SERVICE_RUN_ID = process.env.PLAYWRIGHT_SERVICE_RUN_ID || new Date().toISOString();

// Can be 'linux' or 'windows'.
const os = process.env.PLAYWRIGHT_SERVICE_OS || 'linux';

export default defineConfig(config, {
  // Define more generous timeout for the service operation if necessary.
  // timeout: 60000,
  // expect: {
  //   timeout: 10000,
  // },
  workers: 20,

  // Enable screenshot testing and configure directory with expectations.
  // https://learn.microsoft.com/azure/playwright-testing/how-to-configure-visual-comparisons
  ignoreSnapshots: false,
  snapshotPathTemplate: `{testDir}/__screenshots__/{testFilePath}/${os}/{arg}{ext}`,

  use: {
    // Specify the service endpoint.
    connectOptions: {
      wsEndpoint: `${"wss://eastus.api.playwright.microsoft.com/accounts/eastus_9964d9c3-2439-4493-8248-b0f4ca724a80/browsers"}?cap=${JSON.stringify({
        // Can be 'linux' or 'windows'.
        os,
        runId: process.env.PLAYWRIGHT_SERVICE_RUN_ID
      })}`,
      timeout: 30000,
      headers: {
        'x-mpt-access-key': PLAYWRIGHT_SERVICE_ACCESS_TOKEN!
      },
      // Allow service to access the localhost.
      exposeNetwork: '<loopback>'
    }
  },
  // Tenmp workaround for config merge bug in OSS https://github.com/microsoft/playwright/pull/28224
  projects: config.projects? config.projects : [{}]
});
