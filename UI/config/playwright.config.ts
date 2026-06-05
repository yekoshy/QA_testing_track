import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: '../', // Make sure this points to the folder containing your script
  fullyParallel: true,
  /* Configure projects for major browsers */
  projects:[
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    
    // You can even add mobile browsers!
     {
       name: 'Mobile Chrome',
       use: { ...devices['Pixel 5'] },
     },
     {
       name: 'Mobile Safari',
       use: { ...devices['iPhone 12'] },
     },
  ],
});