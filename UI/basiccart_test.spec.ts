import { test, expect } from '@playwright/test';

function generateRandomCustomerID(): string {
  const letters = 'abcdefghijklmnopqrstuvwxyz';
  
  // Get 2 random letters
  const char1 = letters.charAt(Math.floor(Math.random() * letters.length));
  const char2 = letters.charAt(Math.floor(Math.random() * letters.length));
  
  // Get 8 random digits (pads with leading zeros if the random number is too short)
  const digits = Math.floor(Math.random() * 100000000).toString().padStart(8, '0');
  
  return `${char1}${char2}${digits}`;
}

test('test', async ({ page }) => {
  test.slow();
  const customerId = generateRandomCustomerID();
  const password = `${customerId}_PASS`;
  
  await page.goto('https://testpages.eviltester.com/apps/basiccart/index.html?page=1&limit=10');
  await expect(page.locator('#productGrid')).toContainText('$646.86');
  await page.getByRole('button', { name: 'Add to Cart' }).first().click();
  await expect(page.locator('#cartCount')).toContainText('1');
  await page.getByText('🛒').click();
  await expect(page.locator('#cartContainer')).toContainText('$646.86');
  
  // Increase quantity
  await page.getByRole('button', { name: '+' }).click();
  await page.getByRole('button', { name: '+' }).click();
  await page.getByRole('button', { name: '+' }).click();
  await page.getByRole('button', { name: '+' }).click();
  await page.getByRole('button', { name: '+' }).click();
  
  await expect(page.locator('#cartContainer')).toContainText('Item Total: $3881.16');
  await expect(page.locator('#cartContainer')).toContainText('Cart Total: $3881.16');
  await page.getByRole('button', { name: 'Checkout' }).click();
  
  // Login flow
  await page.getByRole('textbox', { name: 'Customer ID:' }).fill(customerId);
  await page.waitForTimeout(2000); 
  await page.getByRole('textbox', { name: 'Password:' }).fill(password);
  await page.waitForTimeout(2000); 
  await page.getByRole('button', { name: 'Login' }).click();
  await page.waitForTimeout(2000); 
  await expect(page.url()).toContain('cart');

  // Post-Login Checkout
  await page.getByRole('button', { name: 'Checkout' }).click();
  
  
  await expect(page.locator('#userInfo')).toContainText(customerId); 
  
  await expect(page.locator('#cartCount')).toContainText('6');
  await expect(page.locator('#orderDetails')).toContainText('Product ID: 1, Quantity: 6, Price: $3881.16');
  await expect(page.locator('#orderDetails')).toContainText('Total: $3881.16');
  await expect(page.locator('#orderDetails')).toContainText('State: open');
  await page.getByRole('button', { name: 'Confirm' }).click();
  
  
  await page.getByRole('link', { name: customerId }).click(); 
  
  await expect(page.locator('#ordersContainer')).toContainText('Total: $3881.16 Items: 6');
  await expect(page.locator('#ordersContainer')).toContainText('Product ID: 1 Quantity: 6 Price: $3881.16');
  
  
  await expect(page.locator('#userContent')).toContainText(`Welcome back, ${customerId}!`); 
  
  await page.getByRole('button', { name: 'Logout' }).click();
  await expect(page.locator('#userContent')).toContainText('Your session has expired. Please log in again to continue. Login');
});