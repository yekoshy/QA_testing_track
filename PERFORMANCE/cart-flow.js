const { expect } = require('@playwright/test');

// This function will be executed by Artillery for every simulated user
async function addToCartFlow(page, userContext, events) {
  
  // 1. Start the timer
  const startTime = Date.now();

  // 2. Paste your Playwright Codegen steps here!
  await page.goto('https://testpages.eviltester.com/apps/basiccart/?page=1&limit=10');
  events.emit('histogram', 'metric_page_load', Date.now() - startTime);

  await page.getByRole('button', { name: 'Add to Cart' }).first().click();
  await expect(page.locator('#cartCount')).toContainText('1');

  // 3. Stop the timer & record the metric for Artillery
  events.emit('histogram', 'metric_add_to_cart', Date.now() - startTime);
}

// Export the function so Artillery can use it
module.exports = {
  addToCartFlow
};