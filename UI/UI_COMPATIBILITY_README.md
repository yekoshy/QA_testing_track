# 🎭 QA Testing Track - UI Automation

Welcome to the **UI** folder of the `QA_testing_track` repository! 🚀 

This folder focuses on **Frontend/UI Automation Testing** using **Playwright**, a modern, fast, and reliable testing framework created by Microsoft. 

This guide is written specifically for **absolute beginners**. We will walk you through the setup process and teach you how to use Playwright's **Record-n-Play (Codegen)** feature to generate tests simply by interacting with a browser!

---

## 🛠️ Prerequisites
Before we begin, please make sure you have the following installed on your computer:
1. **[Node.js](https://nodejs.org/)** (LTS version is recommended) - The engine that runs our testing environment.
2. **[Visual Studio Code (VS Code)](https://code.visualstudio.com/)** - A beginner-friendly code editor.

---

## 🚀 Step-by-Step Setup Guide

### Step 1: Create the Repository
First, create the repository on your local machine
```bash
mkdir <folder_name>
```

### Step 2: Navigate to the UI Folder 

```bash
cd <folder_name>
```

### Step 3: Install Project Dependencies
In this step, we will download all the necessary Node.js packages required to run the project. Run this command:
```bash
# Initialize a new Node.js project
npm init -y

# Install Playwright Test runner as a dev dependency
npm install -D @playwright/test

# Install supported browsers (Chromium, Firefox, WebKit)
npx playwright install

# Install Node.js type definitions for TypeScript support in Playwright
npm install --save-dev @types/node

# Install cross-env so environment variables work across Windows/macOS/Linux
npm install -g cross-env
```

---

## 🎥 Writing Tests with "Record-n-Play" (Codegen)
The best feature for beginners in Playwright is the **Test Generator (Codegen)**. It records your actions in the browser and automatically writes the automation code for you!

### How to record your first test:
1. Run the following command in your terminal:
   ```bash
   npx playwright codegen -o basicCart_test.spec.ts
   ```
2. Two windows will pop up:
   - A **Browser window** (where you will interact with the website).
   - The **Playwright Inspector window** (where the code will magically appear).
3. Type URL into the browser (`https://testpages.eviltester.com/apps/basiccart/`) and start clicking, typing, and navigating just like a normal user.
4. Watch as Playwright records your exact steps and generates the code in the Inspector!


---

## 🧪 Running Your Tests

Once you have saved your tests, you can run them in several ways depending on your needs. Run these commands in your terminal:

### 1. Run in UI Mode (Highly Recommended for Beginners 🌟)
UI Mode opens a beautiful interface where you can visually see your tests run, pause them, step through them one by one, and easily see where a test failed.
```bash
npx playwright test --ui basicCart_test.spec.ts
```

### 2. Run in Headed Mode (Watch the browser)
If you want to watch the browser actually open and perform the clicks visually in real-time:
```bash
npx playwright test --headed basicCart_test.spec.ts
```
### 3. Config Execution
Run the test using the shared Playwright config file so it applies the defined browsers, devices, retries, and workers:
```bash
npx playwright test basicCart_test.spec.ts --config=config/playwright.config.ts
```
---

## 📊 Viewing HTML Test Reports
After your tests finish running, Playwright automatically generates a detailed HTML report. If any test fails, this report will help you understand exactly what went wrong.

To view the report, run:
```bash
npx playwright test basicCart_test.spec.ts --config=config/playwright.config.ts  --reporter=html
```

---
## 🐛 Debugging with Traces (Video & Playback)

When a test fails (or you want to verify a bug test case), you can record a "trace". A trace captures a video, network requests, console logs, and a step-by-step DOM snapshot.

### Generate a Trace
Run your test with the `--trace on` flag:
```bash
npx playwright test basicCart_test.spec.ts --trace on 
```
*This will generate a zip file inside the `test-results/` folder.*

### View the Trace
There are two ways to view the captured trace:

**Option 1: View Locally via Command Line**
```bash
npx playwright show-trace test-results/basicCart_test-test/trace.zip
```

**Option 2: View Online in the Browser**
1. Open [https://trace.playwright.dev/](https://trace.playwright.dev/)
2. Drag and drop your `trace.zip` file directly into the webpage.
---

## 📁 Understanding the Folder Structure

Here is a quick overview of what the files in this `UI` folder do:

* `tests/` ➡️ This is where you will save all your test files (e.g., `example.spec.ts`).
* `playwright.config.ts` ➡️ The master settings file. It controls which browsers to test on, timeouts, and report generation.
* `package.json` ➡️ A list of all the dependencies and scripts needed for this Node.js project.

---

## 💡 Pro-Tips for Beginners
* **Pause your test:** You can pause a running test at any time to inspect the browser by adding `await page.pause();` in your test code.
* **Use the VS Code Extension:** Search for "Playwright Test for VSCode" in the VS Code extensions tab. It allows you to run and debug tests directly by clicking a play button right next to your code!

**Happy Testing!** 🎉
