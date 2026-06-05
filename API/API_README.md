# 🚀 Postman to Playwright API Testing Guide

Welcome! This repository demonstrates how to translate a standard Postman API collection into an automated Playwright API test suite. 

If you are a beginner looking to move from manual/Postman API testing into automated testing with code, this step-by-step guide is for you.

## 🔗 Project Resources
* **Postman Collection:** [BasicStore_APITesting](https://www.postman.com/fl1111/public-yekoshy/collection/7sn7flw/basicstore-apitesting?action=share&source=copy-link&creator=19484409)
* **API Documentation:** [View on Postman Documenter](https://documenter.getpostman.com/view/19484409/2sBXwpPry3)
* **Postman Export File:** `BasicStore_APITesting.postman_collection.json`
* **Playwright Test Script:** [`basic-store.spec.ts`](https://github.com/yekoshy/QA_testing_track/blob/main/API/basic-store.spec.ts)
* **Playwright HTML Report:** [View Report](https://yekoshy.github.io/QA_testing_track/API/playwright-report/index.html)

---

## ⚖️ Postman vs. Playwright: The Basics

**Postman** is a fantastic tool with a graphical interface for exploring APIs. You use the "Tests" tab to write JavaScript assertions using the `pm` object (e.g., `pm.response.to.have.status(200)`). 

**Playwright** is a powerful automation framework built for modern web and API testing. Moving to Playwright allows you to:
1. Keep your API tests in the same codebase as your frontend tests.
2. Easily run your tests in CI/CD pipelines (like GitHub Actions).
3. Use powerful assertion libraries.

### 📝 Quick Translation Cheat Sheet
| Action | Postman Script | Playwright TypeScript |
| :--- | :--- | :--- |
| **Verify Status** | `pm.response.to.have.status(200);` | `expect(response.status()).toBe(200);` |
| **Parse JSON** | `const data = pm.response.json();` | `const data = await response.json();` |
| **Verify Value** | `pm.expect(data.count).to.eql(100);` | `expect(data.count).toEqual(100);` |
| **URL Params** | `{{url}}/products?limit=10` | `request.get('/products', { params: { limit: 10 } })` |

---

## 💻 Step-by-Step Setup Guide

Before you begin, ensure you have [Node.js](https://nodejs.org/) installed on your computer.

### Step 1: Initialize your project
Open your terminal/command prompt, create a new folder for your project, navigate into it, and initialize a new Node.js project. This creates a `package.json` file.
```bash
npm init -y
```

### Step 2: Install Playwright and Dependencies
Next, install Playwright as a development dependency. We will also install `ajv`, which is a library that allows us to perform JSON Schema Validation (just like Postman does under the hood!).
```bash
npm install -D @playwright/test
npm install ajv
```

### Step 3: Install Playwright Browsers
Playwright requires you to install its browsers and system dependencies. Even though we are doing API testing, it's best practice to initialize Playwright fully.
```bash
npx playwright install
```

### Step 4: Add your test file
Create a file named `basic-store.spec.ts` in your project folder and paste the Playwright code into it. 

*(Make sure your file structure looks like this)*:
```text
📁 your-project-folder/
 ├─ 📄 package.json
 ├─ 📄 package-lock.json
 └─ 📄 basic-store.spec.ts
```

### Step 5: Run the tests!
Execute the test file. We are passing the `--reporter=html` flag so Playwright generates a beautiful visual report of our API test results.
```bash
npx playwright test basic-store.spec.ts --reporter=html
```
*(Note: If you are using Windows PowerShell, you can also use `npx playwright test .\basic-store.spec.ts --reporter=html`)*

### Step 6: View the Report
Once the tests finish running, Playwright will usually open the report automatically. If it doesn't, or if you want to open it again later, run:
```bash
npx playwright show-report
```
This will open a local webpage showing you exactly which API calls passed, failed, and how long they took!

---

## 💡 What's happening in the code?
If you look inside `basic-store.spec.ts`, you'll notice:
* `test.use({ baseURL: '...' })`: Sets the base URL, similar to a Postman Environment variable.
* `ajv.compile(schema)`: Replaces Postman's `pm.response.to.have.jsonSchema`. It checks that the API responds with the exact data types we expect.
* `await request.get(...)`: Sends the actual API calls.

Happy Testing! 🚀
