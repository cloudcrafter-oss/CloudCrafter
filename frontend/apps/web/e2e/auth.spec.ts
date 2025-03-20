import { expect, test } from '@playwright/test'

test.describe('Authentication', () => {
	test('should show login page when not authenticated', async ({ page }) => {
		// Navigate to a protected page
		await page.goto('/dashboard')

		// Should be redirected to login
		await expect(page).toHaveURL(/.*login/)
	})

	// This test is commented out as it requires actual authentication
	// You'll need to modify it with your actual auth flow
	/*
  test('should login successfully with valid credentials', async ({ page }) => {
    // Navigate to login page
    await page.goto('/login');
    
    // Fill in login form
    await page.getByLabel('Email').fill('test@example.com');
    await page.getByLabel('Password').fill('password123');
    
    // Click login button
    await page.getByRole('button', { name: 'Sign in' }).click();
    
    // Should redirect to dashboard after successful login
    await expect(page).toHaveURL('/dashboard');
  });
  */
})
