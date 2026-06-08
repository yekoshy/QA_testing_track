# 🛒 E-Commerce QA Testing Track

Welcome to the **QA Testing Track** repository! 

If you are a beginner looking to understand how a web application is tested from top to bottom, you are in the right place. This repository serves as a comprehensive portfolio demonstrating how to test a web application from multiple perspectives: UI, API, Database, and Performance.

## 🎯 Application Under Test
The target application for all tests in this repository is a mock e-commerce cart:
🔗 **[EvilTester Basic Cart App](https://testpages.eviltester.com/apps/basiccart/?page=1&limit=10)**

## 📚 E-Commerce Testing Reference
Before diving into the code, it helps to understand the "why" behind what we test. Check out this reference presentation for the core concepts and strategies used in this project:
📽️ **[E-Commerce Testing Prezi Presentation](https://prezi.com/view/UyoKqJzqH69fIFpEZihx/?referral_token=YlRBZjlnB3FN)**

---

## 🗂️ Step-by-Step Guide for Beginners

To get the most out of this repository, I recommend exploring the files and folders in the following order. It mimics the real-world workflow of a QA Engineer!

### Step 1: Understand the Product and Test Design
Before writing any test automation, we need to understand *how* the application works and *what* to test.
*   🗺️ **[Product Journey & Flow Diagram](ProductJourney.md):** Start here. This diagrams the user flow and expected actions within the application.
*   📝 **[Test Cases](testcases.md):** Next, read through the manual test cases. This file outlines the specific scenarios we are testing based on the product journey.

### Step 2: Front-End Testing (UI & Compatibility)
Once you understand the features, let's look at how we test the visual and interactive parts of the application.
*   💻 **[UI + Compatibility Testing](UI/UI_COMPATIBILITY_README.md):** Learn how we verify that the web application works correctly across different browsers, devices, and screen sizes, ensuring a seamless user experience.

### Step 3: Back-End Testing (API & Database)
The frontend is just the tip of the iceberg. Let's dive into the backend to see how data is transferred and stored.
*   ⚙️ **[API Testing](API/API_README.md):** Discover how we test the Application Programming Interfaces (APIs). This ensures the frontend and backend communicate correctly without relying on the UI.
*   🗄️ **[Database Testing](DB/DB_README.md):** Understand how we verify that user actions (like adding items to a cart) correctly update the underlying database records.

### Step 4: Non-Functional Testing (Performance & Load)
Finally, we need to ensure the application can handle real-world traffic without crashing or slowing down.
*   🚀 **[API Load/Performance Testing](PERFORMANCE/API_PERFORMANCE_README.md):** See how we test the backend's ability to handle high volumes of API requests simultaneously.
*   🏎️ **[UI Load/Performance Testing](PERFORMANCE/PERFORMANCE_README.md):** Learn how we measure the page load times and frontend responsiveness under stress.

---

## 🚀 Getting Started

To explore any specific type of testing, simply click on the links in the steps above. Each folder contains its own detailed `README.md` with specific instructions, the tools used, and steps to execute the tests on your local machine.

Happy Testing! 🐛🔨