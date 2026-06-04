# Test Suite: Basic Shopping Cart Micro-App

**Target Application:** [Basic Cart](https://testpages.eviltester.com/apps/basiccart/?page=1&limit=10)  
**Documentation:** [Basic Cart Instructions](https://testpages.eviltester.com/apps/basiccart/basiccart-instructions/)

---

## Table of Contents
* [1. Global App-Wide Tests](#1-global-app-wide-tests)
  * [Global Security Tests](#global-security-tests)
  * [Global Performance Tests](#global-performance-tests)
  * [Global Compatibility & Usability Tests](#global-compatibility--usability-tests)
* [2. Product List Page (PLP)](#2-product-list-page-plp)
  * [PLP Functional Tests](#plp-functional-tests)
  * [PLP Negative & Edge Cases](#plp-negative--edge-cases)
  * [PLP UI/UX](#plp-uiux)
* [3. Product View Page (PVP)](#3-product-view-page-pvp)
  * [PVP Functional Tests](#pvp-functional-tests)
  * [PVP Negative & Edge Cases](#pvp-negative--edge-cases)
* [4. Cart Page](#4-cart-page)
  * [Cart Functional Tests](#cart-functional-tests)
  * [Cart Negative & Edge Cases](#cart-negative--edge-cases)
  * [Cart UI/UX](#cart-uiux)
* [5. Login Page](#5-login-page)
  * [Login Functional Tests](#login-functional-tests)
  * [Login Negative & Edge Cases](#login-negative--edge-cases)
  * [Login UI/UX](#login-uiux)
* [6. Checkout Flow](#6-checkout-flow)
  * [Checkout Functional Tests](#checkout-functional-tests)
  * [Checkout Negative & Edge Cases](#checkout-negative--edge-cases)
* [7. User Page (Orders)](#7-user-page-orders)
  * [User Page Functional Tests](#user-page-functional-tests)
  * [User Page Negative & Edge Cases](#user-page-negative--edge-cases)

---

## 1. Global App-Wide Tests

### Global Security Tests
* **SEC-01 [Session Management]:** Verify that users cannot access the `/checkout` or `/user` endpoints without an active authenticated session cookie.
* **SEC-02 [IDOR - Insecure Direct Object Reference]:** Attempt to view or delete orders belonging to another user by manipulating user IDs or order IDs in API requests/URLs.
* **SEC-03 [XSS - Cross-Site Scripting]:** Inject basic XSS payloads (e.g., `<script>alert(1)</script>`) into URL parameters (like `?page=`) or any available input fields to ensure they are properly sanitized or encoded.
* **SEC-04 [Data Exposure]:** Inspect network traffic to ensure no sensitive user data or plaintext passwords are leaked in HTTP responses or local storage.

### Global Performance Tests
* **PERF-01 [Load Testing]:** Simulate 100 concurrent users accessing the Product List Page and adding items to the cart simultaneously. Verify response times remain under 2 seconds.
* **PERF-02 [Large Pagination]:** Set the `limit` parameter in the URL to a very high number (e.g., `?limit=10000`). Verify if the database handles the query gracefully or if the system crashes (API timeout).

### Global Compatibility & Usability Tests
* **COMP-01 [Cross-Browser]:** Verify the app functions correctly on the latest versions of Chrome, Firefox, Safari, and Edge.
* **COMP-02 [Mobile Responsiveness]:** Open the application on mobile viewport dimensions (e.g., 375x812). Verify the cart, navigation, and product grids stack correctly and remain usable without horizontal scrolling.
* **USAB-01 [Accessibility (a11y)]:** Verify that all buttons ("Add to Cart", "Checkout") are keyboard-navigable (using `Tab` and `Enter`) and have appropriate ARIA labels for screen readers.

[⬆ Back to Top](#table-of-contents)

---

## 2. Product List Page (PLP)

### PLP Functional Tests
* **TC-PLP-01:** Verify that clicking "Add to Cart" on a product increments the cart counter by 1.
* **TC-PLP-02:** Verify that clicking "View More Details" navigates the user to the correct Product View Page.
* **TC-PLP-03:** Verify pagination works: Clicking "Next" loads the next set of items, and "Prev" navigates back correctly.

### PLP Negative & Edge Cases
* **TC-PLP-04 [Negative]:** Manipulate URL parameters to invalid values (e.g., `?page=-1`, `?page=abc`, `?limit=0`, `?limit=-10`). Verify the app handles this gracefully (e.g., falls back to default `page=1&limit=10` or shows a 404/400 error).
* **TC-PLP-05 [Edge]:** Attempt to access a page number that exceeds the total number of products (e.g., `?page=9999`). Verify the app displays an "End of catalog" or "No products found" message.

### PLP UI/UX
* **TC-PLP-06:** Verify product images, titles, and prices render correctly and uniformly on the grid.

[⬆ Back to Top](#table-of-contents)

---

## 3. Product View Page (PVP)

### PVP Functional Tests
* **TC-PVP-01:** Verify the product details (Title, Image, Description, Price) match the item clicked on the PLP.
* **TC-PVP-02:** Verify the "Add to Cart" button successfully adds the current item to the cart.
* **TC-PVP-03:** Verify the "Back to Catalog" (or back navigation) returns the user to their previous position on the PLP (maintaining the correct page number).

### PVP Negative & Edge Cases
* **TC-PVP-04 [Negative]:** Manually change the product ID in the URL to a non-existent ID (e.g., `?id=999999` or `?id=invalid`). Verify the app shows a "Product Not Found" error instead of a stack trace.

[⬆ Back to Top](#table-of-contents)

---

## 4. Cart Page

### Cart Functional Tests
* **TC-CART-01:** Verify that all added items are displayed with their correct individual prices.
* **TC-CART-02:** Change the quantity of an item using the input field. Verify the system automatically refreshes and calculates the correct line-item subtotal and overall cart total.
* **TC-CART-03:** Verify clicking "Submit / Proceed to Checkout" redirects to the Checkout Flow.

### Cart Negative & Edge Cases
* **TC-CART-04 [Negative]:** Enter invalid data into the quantity field (e.g., `-1`, `0`, `abc`, `@#$`, `1.5`). Verify the system rejects the input or auto-corrects to a valid integer (e.g., removes item if 0).
* **TC-CART-05 [Edge]:** Enter an extremely high number in the quantity field (e.g., `999999999`). Verify the system handles integer limits safely without causing database overflows or negative price roll-overs.
* **TC-CART-06 [Negative]:** Attempt to proceed to checkout with a completely empty cart. Verify the user is blocked with a validation message.

### Cart UI/UX
* **TC-CART-07:** Verify that an empty cart displays a clear, user-friendly message (e.g., "Your cart is currently empty") with a link to continue shopping.

[⬆ Back to Top](#table-of-contents)

---

## 5. Login Page

### Login Functional Tests
* **TC-LOG-01:** Enter valid credentials. Verify successful login and proper redirection back to the Checkout Flow.

### Login Negative & Edge Cases
* **TC-LOG-02 [Negative]:** Enter invalid credentials. Verify a generic, secure error message is shown (e.g., "Invalid username or password" rather than "Username does not exist").
* **TC-LOG-03 [Negative]:** Submit empty username and password fields. Verify HTML5/JS validation blocks the submission and shows required field errors.
* **TC-LOG-04 [Security]:** Attempt SQL Injection payloads in the username field (e.g., `admin' OR 1=1 --`). Verify the application rejects the login attempt.

### Login UI/UX
* **TC-LOG-05:** Verify the password field characters are masked (type="password").

[⬆ Back to Top](#table-of-contents)

---

## 6. Checkout Flow

### Checkout Functional Tests
* **TC-CHK-01:** Verify that upon submitting a valid cart by an authenticated user, an order is created successfully in the `OPEN` state.
* **TC-CHK-02:** Verify that clicking "Confirm Order" transitions the backend order state from `OPEN` to `ACCEPTED`.

### Checkout Negative & Edge Cases
* **TC-CHK-03 [Edge]:** Open the checkout confirmation page in two separate browser tabs. Confirm the order in Tab A. Attempt to confirm it again in Tab B. Verify the system handles this gracefully without creating duplicate charges or throwing a server error.
* **TC-CHK-04 [Security]:** Try to modify the order total by intercepting the HTTP POST request to the checkout endpoint. Verify the server recalculates and relies on backend pricing, not client-provided totals.

[⬆ Back to Top](#table-of-contents)

---

## 7. User Page (Orders)

### User Page Functional Tests
* **TC-USR-01:** Verify the User Page accurately lists all historical orders for the logged-in user.
* **TC-USR-02:** Verify that orders correctly display their status as either `OPEN` or `ACCEPTED`.
* **TC-USR-03:** Verify that the "Delete" action button is visible and works successfully to remove an order **only** if its status is `OPEN`.

### User Page Negative & Edge Cases
* **TC-USR-04 [Negative]:** For an order in the `ACCEPTED` state, verify that no "Delete" button is rendered in the UI.
* **TC-USR-05 [Security/Edge]:** Force a Delete request for an `ACCEPTED` order (via Postman, cURL, or browser dev tools). Verify the backend rejects the request and enforces the business rule (Cannot delete accepted orders).
* **TC-USR-06 [Functional]:** Delete an `OPEN` order, then navigate back to the catalog, add new items, and checkout again. Verify a new distinct order ID is generated.

[⬆ Back to Top](#table-of-contents)
