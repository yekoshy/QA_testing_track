Combining **Playwright** (for real browser interactions) with **Artillery** (for load generation) is incredibly powerful. It allows you to simulate actual users clicking buttons in real browsers, rather than just pinging API endpoints.

Here is the step-by-step guide to fulfilling your **PERF-01** test case using `playwright codegen` and Artillery.

⚠️ **Important Note on Browser Load Testing:** Spinning up 100 *actual browsers* simultaneously takes massive CPU and RAM. If you run this on a standard laptop, your computer may freeze. To achieve exactly 100 concurrent *browser* users, this is usually run on distributed cloud workers (like Artillery Cloud or AWS). For local testing, we will run it in "headless" mode.

---

### Step 1: Install Artillery & Playwright
Open your terminal in your project folder and install the necessary packages.

```bash
# Install Artillery globally (or locally if you prefer)
npm install -g artillery

# Ensure Playwright is installed
npm install -D @playwright/test
npx playwright install
```

---

### Step 2: Record the User Journey (`playwright codegen`)
We will use Playwright's code generator to record the exact actions: accessing the page and adding an item to the cart.

Run this command in your terminal:
```bash
npx playwright codegen https://testpages.eviltester.com/apps/basiccart/?page=1&limit=10
```

**Actions to take in the browser that pops up:**
1. Let the page load.
2. Click the **"Add to Cart"** button on the very first product.
3. Close the browser.

---

### Step 3: Adapt the Script for Artillery


---

### Step 4: Create the Artillery Configuration (YAML)
Now, we tell Artillery *how* to run the load test (100 concurrent users, SLA under 2 seconds).

Create a file named `perf-test.yml` in the same directory:

**`perf-test.yml`**
```yaml
config:
  target: "https://testpages.eviltester.com"
  
  # Enable the Playwright engine
  engines:
    playwright: {}

  # Link to the script we created in Step 3
  processor: "./cart-flow.js"

  # Define the Load Pattern
  phases:
    - duration: 30       # Run the test for 30 seconds
      arrivalRate: 5     # 5 new users arrive every second
      maxVusers: 100     # Cap at 100 concurrent users
      name: "Ramping up to 100 concurrent users"

  # PERF-01 Verification: Ensure response times remain under 2 seconds (2000ms)
  ensure:
    thresholds:
      # This checks the custom metric we created in cart-flow.js
      # "p95" means 95% of the users must complete the journey in under 2000ms
      - "user_journey_duration.p95": 2000 

scenarios:
  - engine: playwright
    testFunction: "addToCartFlow"
```

---

### Step 5: Run the Load Test
Now it is time to run the test. 

To run it without launching 100 actual browser windows on your screen (Headless mode):
```bash
artillery run perf-test.yml --record --key <key>
artillery run perf-stages-test.yml --record --key <key>
```
