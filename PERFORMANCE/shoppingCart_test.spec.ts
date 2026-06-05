import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('https://testpages.eviltester.com/apps/basiccart/?page=1&limit=10');
  await page.getByRole('button', { name: 'Add to Cart' }).first().click();
  await expect(page.locator('#cartCount')).toContainText('1');
});