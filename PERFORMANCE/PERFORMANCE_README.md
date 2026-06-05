# Playwright + Artillery Load Testing

Combining **Playwright** (for real browser interactions) with **Artillery** (for load generation) is incredibly powerful. It allows you to simulate actual users clicking buttons in real browsers, rather than just pinging API endpoints.

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
npx playwright codegen https://testpages.eviltester.com/apps/basiccart/?page=1&limit=10 -o shoppingCart_test.spec.ts
```

**Actions to take in the browser that pops up:**
1. Let the page load.
2. Click the **"Add to Cart"** button on the very first product.
3. Close the browser.

---

### Step 3: Adapt the Script for Artillery (`cart-flow.js`)

Create a JavaScript file to tell Artillery how to execute the Playwright steps and generate custom performance metrics.

**`cart-flow.js`**
```javascript
const { expect } = require('@playwright/test');

// This function will be executed by Artillery for every simulated user
async function addToCartFlow(page, userContext, events) {
  
  // 1. Start the timer
  let stepStart = Date.now();

  // 2. Paste your Playwright Codegen steps here!
  await page.goto('https://testpages.eviltester.com/apps/basiccart/?page=1&limit=10');
  events.emit('histogram', 'metric_page_load', Date.now() - stepStart);

  stepStart = Date.now();
  await page.getByRole('button', { name: 'Add to Cart' }).first().click();
  await expect(page.locator('#cartCount')).toContainText('1');

  // 3. Stop the timer & record the metric for Artillery
  events.emit('histogram', 'metric_add_to_cart', Date.now() - stepStart);
}

// Export the function so Artillery can use it
module.exports = {
  addToCartFlow
};
```

---

### Step 4: Create the Artillery Configurations (YAML)

Now, we tell Artillery *how* to run the load test. We have created two different scenarios: a **Basic Load Test** and a **Staged Load Test**.

#### 1. Basic Load Test
This config defines a simple 30-second test that ramps up to 100 concurrent users.

**`perf-test.yml`**
```yaml
config:
  target: "https://testpages.eviltester.com"
  
  # Enable the Playwright engine
  engines:
    playwright: {
      trace: {
        enabled: true
      }
    }

  # Link to the script we created in Step 3
  processor: "./cart-flow.js"
  
  # Add the ensure check here:
  plugins:
    ensure:
      conditions:
      # This checks the custom metric we created in cart-flow.js
        - expression: "metric_add_to_cart.p95 < 3000"
        - expression: "vusers.failed == 0"
        - expression: "metric_page_load.p95 < 4000"
        - expression: "vusers.completed >= 90"

  # Define the Load Pattern
  phases:
    - duration: 30       # Run the test for 30 seconds
      arrivalRate: 5     # 5 new users arrive every second
      maxVusers: 100     # Cap at 100 concurrent users
      name: "Ramping up to 100 concurrent users"

scenarios:
  - engine: playwright
    testFunction: "addToCartFlow"
```

#### 2. Staged Load Test (Warm up -> Ramp up -> Spike)
This advanced config models realistic real-world traffic with different load phases.

**`perf-stages-test.yml`**
```yaml
config:
  target: "https://testpages.eviltester.com"
  
  # Enable the Playwright engine
  engines:
    playwright: {
      trace: {
        enabled: true
      }
    }

  # Link to the script we created in Step 3
  processor: "./cart-flow.js"
  
  # Add the ensure check here:
  plugins:
    ensure:
      conditions:
      # This checks the custom metric we created in cart-flow.js
        - expression: "metric_add_to_cart.p95 < 3000"
        - expression: "vusers.failed == 0"
        - expression: "metric_page_load.p95 < 4000"
        - expression: "vusers.completed >= 90"

  # Define the Load Pattern
  phases:
    - name: "Warm up"
      duration: 60 # 1 minute
      arrivalRate: 1 # 1 user per second
      
    - name: "Ramp up"
      duration: 180 # 3 minutes
      arrivalRate: 1 # Start at 1 user per second...
      rampTo: 10 # ...and gradually increase to 10 users per second
      
    - name: "Spike"
      duration: 30 # 30 seconds
      arrivalRate: 20 # 100 users per second immediately

scenarios:
  - engine: playwright
    testFunction: "addToCartFlow"
```

---

### Step 5: Run the Load Test & View Reports

Now it is time to run the test and generate cloud reports.

Run the basic test (headless mode, recording to Artillery Cloud):
```bash
npx artillery run perf-test.yml --record --key <your-artillery-key>
```
👉 **[View Basic Test Output Report](https://app.artillery.io/share/sh_a102e7ffa8d362b746b565907a4475b7b3fe96233b837c77d3c7cd41f287ae41)**

Run the multi-staged test:
```bash
npx artillery run perf-stages-test.yml --record --key <your-artillery-key>
```
👉 **[View Staged Test Output Report](https://app.artillery.io/share/sh_3626a2035d1e5a5e080b3d301107fcfdcb804ace1da410feb503a934a79a9697)**
