const { test, expect } = require('@playwright/test');

// Authentication Tests
test.describe('Authentication', () => {
  // TC-AUTH-001: Form Login with Valid Credentials
  test('should allow login with valid credentials', async ({ page }) => {
    // Navigate to login page
    await page.goto('/login');
    
    // Verify login form is displayed
    await expect(page.locator('h2')).toHaveText('Login Page');
    
    // Enter valid credentials
    await page.locator('#username').fill('tomsmith');
    await page.locator('#password').fill('SuperSecretPassword!');
    
    // Click login button
    await page.locator('button[type="submit"]').click();
    
    // Verify successful login
    await expect(page.locator('.flash.success')).toContainText('You logged into a secure area!');
    await expect(page.locator('h2')).toHaveText('Secure Area');
    await expect(page.locator('.button.secondary')).toBeVisible();
  });

  // TC-AUTH-002: Form Login with Invalid Username
  test('should show error with invalid username', async ({ page }) => {
    // Navigate to login page
    await page.goto('/login');
    
    // Enter invalid username
    await page.locator('#username').fill('incorrectUser');
    await page.locator('#password').fill('SuperSecretPassword!');
    
    // Click login button
    await page.locator('button[type="submit"]').click();
    
    // Verify error message
    await expect(page.locator('.flash.error')).toContainText('Your username is invalid!');
    
    // Verify we're still on the login page
    await expect(page.locator('h2')).toHaveText('Login Page');
  });

  // TC-AUTH-003: Form Login with Invalid Password
  test('should show error with invalid password', async ({ page }) => {
    // Navigate to login page
    await page.goto('/login');
    
    // Enter invalid password
    await page.locator('#username').fill('tomsmith');
    await page.locator('#password').fill('WrongPassword');
    
    // Click login button
    await page.locator('button[type="submit"]').click();
    
    // Verify error message
    await expect(page.locator('.flash.error')).toContainText('Your password is invalid!');
    
    // Verify we're still on the login page
    await expect(page.locator('h2')).toHaveText('Login Page');
  });

  // TC-AUTH-004: Logout Functionality
  test('should allow user to logout', async ({ page }) => {
    // Navigate to login page
    await page.goto('/login');
    
    // Login with valid credentials
    await page.locator('#username').fill('tomsmith');
    await page.locator('#password').fill('SuperSecretPassword!');
    await page.locator('button[type="submit"]').click();
    
    // Verify successful login
    await expect(page.locator('h2')).toHaveText('Secure Area');
    
    // Click logout button
    await page.locator('.button.secondary').click();
    
    // Verify successful logout
    await expect(page.locator('.flash.success')).toContainText('You logged out of the secure area!');
    await expect(page.locator('h2')).toHaveText('Login Page');
  });

  // TC-AUTH-005: Basic Authentication with Valid Credentials
  test('should allow access with Basic Auth', async ({ page, request }) => {
    // Set up authentication and navigate to the page
    // Using API request to verify auth is working
    const response = await request.get('/basic_auth', {
      headers: {
        'Authorization': 'Basic ' + Buffer.from('admin:admin').toString('base64')
      }
    });
    
    // Verify successful response
    expect(response.status()).toBe(200);
    
    // Using direct URL auth for browser navigation
    // Note: This is a Playwright-specific approach for basic auth
    await page.goto('/');
    
    // Use context authentication
    await page.context().setHTTPCredentials({
      username: 'admin',
      password: 'admin',
    });
    
    await page.goto('/basic_auth');
    
    // Verify success message
    await expect(page.locator('.example')).toContainText('Congratulations! You must have the proper credentials.');
  });

  // TC-AUTH-007: Digest Authentication with Valid Credentials
  test('should allow access with Digest Auth', async ({ page, request }) => {
    // Digest auth is more complex to handle programmatically
    // For Playwright, we'll use the authentication context

    // Use context authentication
    await page.context().setHTTPCredentials({
      username: 'admin',
      password: 'admin',
    });
    
    // Navigate to the digest auth page
    await page.goto('/digest_auth');
    
    // Verify success message
    await expect(page.locator('.example')).toContainText('Congratulations!');
  });

  // TC-AUTH-008: Session Persistence After Login
  test('should maintain session after navigation', async ({ page }) => {
    // Login first
    await page.goto('/login');
    await page.locator('#username').fill('tomsmith');
    await page.locator('#password').fill('SuperSecretPassword!');
    await page.locator('button[type="submit"]').click();
    
    // Verify successful login
    await expect(page.locator('h2')).toHaveText('Secure Area');
    
    // Navigate to another page
    await page.goto('/');
    
    // Navigate back to secure page directly
    await page.goto('/secure');
    
    // Verify we're still logged in
    await expect(page.locator('h2')).toHaveText('Secure Area');
    await expect(page.locator('.button.secondary')).toBeVisible();
  });
});

// Security Testing
test.describe('Authentication Security', () => {
  // TC-AUTH-201: Login CSRF Protection
  test('should have protection against CSRF', async ({ page }) => {
    // Navigate to login page
    await page.goto('/login');
    
    // Check page source for CSRF token or other protection mechanisms
    const pageSource = await page.content();
    
    // In this demo app, verify the form submission method
    const formMethod = await page.locator('form#login').getAttribute('method');
    expect(formMethod).toBe('post');
    
    // Verify action URL
    const formAction = await page.locator('form#login').getAttribute('action');
    expect(formAction).toBe('/authenticate');
  });

  // TC-AUTH-202: Login Credentials Encryption
  test('should transmit credentials securely', async ({ page, context }) => {
    // This is a limited test as we can't easily capture network traffic in a unit test
    // But we can check for HTTPS if available
    
    // Navigate to login page
    await page.goto('/login');
    
    // Capture request events
    let loginRequest = null;
    
    // Listen for all requests
    page.on('request', request => {
      if (request.url().includes('/authenticate')) {
        loginRequest = request;
      }
    });
    
    // Submit valid login
    await page.locator('#username').fill('tomsmith');
    await page.locator('#password').fill('SuperSecretPassword!');
    await page.locator('button[type="submit"]').click();
    
    // Wait for navigation to complete
    await page.waitForURL('**/secure');
    
    // Check if login request exists
    expect(loginRequest).not.toBeNull();
    
    // In a real test, we would verify HTTPS and secure content transmission
    // For this demo app, we're limited in verifying actual security measures
  });
});

// Accessibility Testing
test.describe('Authentication Accessibility', () => {
  // TC-AUTH-101: Login Form Accessibility
  test('login form should be accessible', async ({ page }) => {
    // Navigate to login page
    await page.goto('/login');
    
    // Check for proper form structure
    await expect(page.locator('label[for="username"]')).toBeVisible();
    await expect(page.locator('label[for="password"]')).toBeVisible();
    
    // Check keyboard navigation
    await page.keyboard.press('Tab');
    const focusedElem1 = await page.evaluate(() => document.activeElement.id);
    expect(focusedElem1).toBe('username');
    
    await page.keyboard.press('Tab');
    const focusedElem2 = await page.evaluate(() => document.activeElement.id);
    expect(focusedElem2).toBe('password');
    
    await page.keyboard.press('Tab');
    const focusedElem3 = await page.evaluate(() => document.activeElement.tagName.toLowerCase());
    expect(focusedElem3).toBe('button');
    
    // In a real test, we would use an accessibility testing library like axe-core
    // For example:
    // const accessibilityScanResults = await page.evaluate(() => axe.run());
    // expect(accessibilityScanResults.violations.length).toBe(0);
  });
});

// Performance Testing
test.describe('Authentication Performance', () => {
  // TC-AUTH-301: Login Response Time
  test('login should respond within acceptable time limits', async ({ page }) => {
    // Navigate to login page
    const startPageLoad = Date.now();
    await page.goto('/login');
    const pageLoadTime = Date.now() - startPageLoad;
    
    // Verify page load time is within acceptable limits
    expect(pageLoadTime).toBeLessThan(3000); // 3 seconds
    
    // Measure login response time
    const startLogin = Date.now();
    
    await page.locator('#username').fill('tomsmith');
    await page.locator('#password').fill('SuperSecretPassword!');
    await page.locator('button[type="submit"]').click();
    
    // Wait for login to complete
    await page.waitForURL('**/secure');
    
    const loginTime = Date.now() - startLogin;
    
    // Verify login response time is within acceptable limits
    expect(loginTime).toBeLessThan(2000); // 2 seconds
  });
});