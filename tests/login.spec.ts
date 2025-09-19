import { test, expect } from '@playwright/test';

test.describe('Login Page', () => {
  test('should show validation errors for empty fields', async ({ page }) => {
    await page.goto('http://localhost:4200/auth/login');
    await page.click('button[type="submit"]');
    await expect(page.getByText('Email is required.')).toBeVisible();
    await expect(page.getByText('Password is required.')).toBeVisible();
  });

  test('should show validation error for invalid password (missing uppercase and special)', async ({
    page,
  }) => {
    await page.goto('http://localhost:4200/auth/login');
    await page.fill('input[type="email"]', 'user@example.com');
    await page.fill('input[type="password"]', 'password123'); // invalid: no uppercase, no special char
    await page.click('button[type="submit"]');
    await expect(page.getByText('Password must contain an uppercase letter.')).toBeVisible();
    await expect(page.getByText('Password must contain a special character.')).toBeVisible();
  });

  test('should show validation error for password too short', async ({ page }) => {
    await page.goto('http://localhost:4200/auth/login');
    await page.fill('input[type="email"]', 'user@example.com');
    await page.fill('input[type="password"]', 'P1!a'); // too short
    await page.click('button[type="submit"]');
    await expect(page.getByText('Password must be at least 8 characters.')).toBeVisible();
  });

  test('should show validation error for password missing digit', async ({ page }) => {
    await page.goto('http://localhost:4200/auth/login');
    await page.fill('input[type="email"]', 'user@example.com');
    await page.fill('input[type="password"]', 'Password!'); // no digit
    await page.click('button[type="submit"]');
    await expect(page.getByText('Password must contain a digit.')).toBeVisible();
  });

  test('should show validation error for password missing lowercase', async ({ page }) => {
    await page.goto('http://localhost:4200/auth/login');
    await page.fill('input[type="email"]', 'user@example.com');
    await page.fill('input[type="password"]', 'PASSWORD1!'); // no lowercase
    await page.click('button[type="submit"]');
    await expect(page.getByText('Password must contain a lowercase letter.')).toBeVisible();
  });

  test('should show validation error for password missing special character', async ({ page }) => {
    await page.goto('http://localhost:4200/auth/login');
    await page.fill('input[type="email"]', 'user@example.com');
    await page.fill('input[type="password"]', 'Password1'); // no special char
    await page.click('button[type="submit"]');
    await expect(page.getByText('Password must contain a special character.')).toBeVisible();
  });

  test('should enable submit button if form is valid', async ({ page }) => {
    await page.goto('http://localhost:4200/auth/login');
    await page.fill('input[type="email"]', 'user@example.com');
    await page.fill('input[type="password"]', 'Password1!'); // valid
    const button = page.locator('button[type="submit"]');
    await expect(button).toBeEnabled();
  });
});
