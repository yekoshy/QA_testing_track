# 🚀 API Load Testing with Artillery

Welcome to the beginner's guide to API Performance and Load Testing! This repository demonstrates how to simulate hundreds of users interacting with an API simultaneously using [Artillery.io](https://artillery.io/). 

In this project, we are testing the [EvilTester Basic Store API](https://testpages.eviltester.com/apps/basiccart/swagger/). We will simulate a user journey where a user **Authenticates** to get a session token, and then uses that token to **Create an Order**.

🔗 **[View the Live Test Dashboard Result Here!](https://app.artillery.io/share/sh_a46e13f039bd0c113eb4f02786b39beda75258eeb871d41b0a6db665879414b8)**

---

## 🛠️ Prerequisites

Before you begin, you need to have Node.js installed on your computer. 
Once Node.js is installed, open your terminal and install Artillery globally:

```bash
npm install -g artillery
```

You can verify the installation by checking the version:
```bash
artillery -V
```

---

## 📁 Project Setup

Our load test requires unique user credentials for every single simulated user to prevent caching and rate-limiting issues. 

Before running the test, generate the `users.csv` file using the included script (or create a file with 1,000 rows matching this format):

**`users.csv` format:**
```csv
userId,password
ye00000001,ye00000001_PASS
ye00000002,ye00000002_PASS
```
*(Artillery will automatically read this file and inject a new user into every virtual user session!)*

---

## 🧠 Understanding the Test Script

The core of our load test is the `api-perf-test.yml` file. Let's break down exactly what this file does into 4 easy steps:

### 1. The Target & Payload (Configuration)
We tell Artillery where the API is located, and give it the `users.csv` file to use for login data.
```yaml
config:
  target: "https://testpages.eviltester.com"
  payload:
    path: "users.csv"
    fields:
      - "userId"
      - "password"
```

### 2. The Load Pattern (Phases)
How aggressively do we want to test the server? We defined 3 phases to see how the server handles different types of traffic:
*   **Phase 1 (Warm up):** 2 users per second for 60 seconds.
*   **Phase 2 (Ramp up):** Gradually increases from 2 users to 10 users per second over 60 seconds.
*   **Phase 3 (Spike/Stress):** A sudden burst of 20 users per second for 30 seconds to see if the server breaks.

### 3. The User Journey (Scenarios)
This is what each "Virtual User" (VU) actually does when they hit the server. Notice how we use `{{ userId }}` to inject data from our CSV!
1.  **POST `/authenticate`:** The user logs in. Artillery *captures* the `sessionId` from the server's response.
2.  **Think Time:** The user waits for 1 second (simulating a real human reading the screen).
3.  **POST `/orders`:** The user sends a payload to create an order, passing the captured `{{ sessionId }}` securely in the headers.

### 4. The Assertions (Ensures)
At the end of the script, we tell Artillery to automatically pass or fail the test based on specific Service Level Agreements (SLAs). 
*   `vusers.failed == 0` (Fail if any user encounters a 400/500 error or drops off).
*   `http.response_time.p95 < 1000` (95% of all requests must be faster than 1 second).

---

## ▶️ How to Run the Test

To run the test locally and see the output in your terminal, run:

```bash
artillery run perf-test.yml 
```

### Advanced Commands

**1. Debug Mode (Find Hidden Errors)**
If your test is failing and you want to see the exact HTTP requests and responses (like `502 Bad Gateway` errors), run it in debug mode:
```bash
# Mac/Linux:
DEBUG=http,http:response artillery run api-perf-test.yml

# Windows:
set DEBUG=http,http:response & artillery run api-perf-test.yml
```

**2. Record to Dashboard**
To generate a beautiful, shareable cloud dashboard (like the one linked at the top of this readme), simply add the `--record` flag:
```bash
npx artillery run api-perf-test.yml --record --key <your-artillery-key>
```

---

## 📊 Understanding the Results

When the test finishes, Artillery will output a Summary Report. Here is what to look for:

*   **`vusers.created`**: The total number of virtual users simulated (e.g., 1080).
*   **`http.codes.200` & `201`**: The number of successful authentications and order creations.
*   **`http.response_time.p95`**: The 95th percentile response time. If this says `327.1`, it means 95% of your users experienced load times of 327 milliseconds or less!

### What happens if the server breaks?
During our testing, we discovered that at the absolute peak load (Phase 3: 20 requests/sec), the server occasionally threw an **`HTTP 502 Bad Gateway`** error. 

If this happens, you will see `vusers.failed` go up, and the terminal will flag your `ensure` checks in **red**. This is a **successful load test**—it means we successfully found the exact breaking point of the API infrastructure!
