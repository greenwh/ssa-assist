/**
 * Wizard Flow E2E Tests
 * Tests the complete report creation workflow
 */

import { test, expect } from '@playwright/test';

test.describe('Report Creation Wizard', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173');
  });

  test('should show passphrase setup on first visit', async ({ page }) => {
    // Check if passphrase setup is shown
    await expect(page.locator('h2:has-text("Create Your Passphrase")')).toBeVisible({
      timeout: 10000,
    });

    // Check for passphrase strength indicator
    await expect(page.locator('input[type="password"]')).toBeVisible();
  });

  test('should create passphrase and unlock', async ({ page }) => {
    // Fill in passphrase
    const passphrase = 'TestSecurePassphrase123!';
    await page.fill('input[type="password"]:first-of-type', passphrase);
    await page.fill('input[type="password"]:nth-of-type(2)', passphrase);

    // Check strength indicator appears
    await expect(page.locator('text=/Strong|Medium|Weak/')).toBeVisible();

    // Submit
    await page.click('button:has-text("Create Passphrase")');

    // Should navigate to dashboard
    await expect(page.locator('h1:has-text("Dashboard")')).toBeVisible({ timeout: 10000 });
  });

  test('should open wizard when clicking "New Report"', async ({ page }) => {
    // Setup passphrase first
    const passphrase = 'TestSecurePassphrase123!';
    await page.fill('input[type="password"]:first-of-type', passphrase);
    await page.fill('input[type="password"]:nth-of-type(2)', passphrase);
    await page.click('button:has-text("Create Passphrase")');

    // Wait for dashboard
    await expect(page.locator('h1:has-text("Dashboard")')).toBeVisible({ timeout: 10000 });

    // Click New Report button
    await page.click('button:has-text("New Report")');

    // Should show wizard
    await expect(page.locator('text="Create New Report"')).toBeVisible();
    await expect(page.locator('text="Step 1"')).toBeVisible();
  });

  test('should navigate through wizard steps', async ({ page }) => {
    // Setup and open wizard
    const passphrase = 'TestSecurePassphrase123!';
    await page.fill('input[type="password"]:first-of-type', passphrase);
    await page.fill('input[type="password"]:nth-of-type(2)', passphrase);
    await page.click('button:has-text("Create Passphrase")');
    await page.waitForSelector('h1:has-text("Dashboard")');
    await page.click('button:has-text("New Report")');

    // Step 1: Blue Book Selection
    await expect(page.locator('text="Blue Book Listings"')).toBeVisible();

    // Select a listing (this will depend on your actual implementation)
    const firstCheckbox = page.locator('input[type="checkbox"]').first();
    await firstCheckbox.check();

    // Click Next
    await page.click('button:has-text("Next")');

    // Step 2: Functional Inputs
    await expect(page.locator('text="Functional Inputs"')).toBeVisible({ timeout: 5000 });

    // Fill some input
    const firstInput = page.locator('input[type="text"]').first();
    await firstInput.fill('Test input data');

    // Click Next
    await page.click('button:has-text("Next")');

    // Step 3: AI Generation
    await expect(page.locator('text="AI Generation"')).toBeVisible({ timeout: 5000 });
  });

  test('should show progress indicator', async ({ page }) => {
    // Setup and open wizard
    const passphrase = 'TestSecurePassphrase123!';
    await page.fill('input[type="password"]:first-of-type', passphrase);
    await page.fill('input[type="password"]:nth-of-type(2)', passphrase);
    await page.click('button:has-text("Create Passphrase")');
    await page.waitForSelector('h1:has-text("Dashboard")');
    await page.click('button:has-text("New Report")');

    // Check progress indicator exists
    const progressBar = page.locator('[role="progressbar"], .progress, [class*="progress"]');
    await expect(progressBar.first()).toBeVisible();
  });

  test('should disable Next button when step is incomplete', async ({ page }) => {
    // Setup and open wizard
    const passphrase = 'TestSecurePassphrase123!';
    await page.fill('input[type="password"]:first-of-type', passphrase);
    await page.fill('input[type="password"]:nth-of-type(2)', passphrase);
    await page.click('button:has-text("Create Passphrase")');
    await page.waitForSelector('h1:has-text("Dashboard")');
    await page.click('button:has-text("New Report")');

    // Next button should be disabled on step 1 without selection
    const nextButton = page.locator('button:has-text("Next")');
    await expect(nextButton).toBeDisabled();
  });

  test('should navigate to Settings', async ({ page }) => {
    // Setup passphrase
    const passphrase = 'TestSecurePassphrase123!';
    await page.fill('input[type="password"]:first-of-type', passphrase);
    await page.fill('input[type="password"]:nth-of-type(2)', passphrase);
    await page.click('button:has-text("Create Passphrase")');
    await page.waitForSelector('h1:has-text("Dashboard")');

    // Navigate to Settings
    await page.click('a[href="/settings"], button:has-text("Settings")');

    // Check Settings page loads
    await expect(page.locator('h1:has-text("Settings")')).toBeVisible({ timeout: 5000 });
    await expect(page.locator('text="LLM Provider Configuration"')).toBeVisible();
  });

  test('should have proper keyboard navigation', async ({ page }) => {
    // Setup passphrase
    const passphrase = 'TestSecurePassphrase123!';
    await page.fill('input[type="password"]:first-of-type', passphrase);

    // Tab to next input
    await page.keyboard.press('Tab');

    // Verify focus moved
    const secondInput = page.locator('input[type="password"]:nth-of-type(2)');
    await expect(secondInput).toBeFocused();
  });

  test('should be responsive on mobile viewport', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    // Check passphrase setup is visible and usable
    await expect(page.locator('h2:has-text("Create Your Passphrase")')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();

    // Touch targets should be at least 44x44px
    const button = page.locator('button').first();
    const box = await button.boundingBox();
    expect(box?.height).toBeGreaterThanOrEqual(44);
  });
});

test.describe('Accessibility', () => {
  test('should have proper page title', async ({ page }) => {
    await page.goto('http://localhost:5173');
    await expect(page).toHaveTitle(/SSA Form-Assist|SSA/);
  });

  test('should have no accessibility violations on homepage', async ({ page }) => {
    await page.goto('http://localhost:5173');

    // Basic accessibility checks
    // Check for proper heading hierarchy
    const h1 = page.locator('h1');
    await expect(h1).toHaveCount(1);

    // Check all images have alt text
    const images = await page.locator('img').all();
    for (const img of images) {
      const alt = await img.getAttribute('alt');
      expect(alt).not.toBeNull();
    }

    // Check all buttons have accessible names
    const buttons = await page.locator('button').all();
    for (const button of buttons) {
      const text = await button.textContent();
      const ariaLabel = await button.getAttribute('aria-label');
      expect(text || ariaLabel).toBeTruthy();
    }
  });

  test('should support keyboard-only navigation', async ({ page }) => {
    await page.goto('http://localhost:5173');

    // Tab through interactive elements
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');

    // Verify an element is focused
    const focusedElement = await page.evaluate(() => document.activeElement?.tagName);
    expect(['INPUT', 'BUTTON', 'A']).toContain(focusedElement);
  });
});
