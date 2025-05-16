const { test, expect } = require('@playwright/test');

// Dynamic Content Tests
test.describe('Dynamic Content', () => {
  // TC-DYN-001: Dynamic Loading - Element Hidden
  test('should load a hidden element', async ({ page }) => {
    // Navigate to the dynamic loading example 1
    await page.goto('/dynamic_loading/1');
    
    // Verify initial state
    await expect(page.locator('#start button')).toBeVisible();
    await expect(page.locator('#finish')).toBeHidden();
    
    // Click the start button
    await page.locator('#start button').click();
    
    // Verify loading indicator appears
    await expect(page.locator('#loading')).toBeVisible();
    
    // Wait for loading to complete and verify hidden element is visible
    // Note: Using waitForSelector with state: 'hidden' for loading indicator
    await page.waitForSelector('#loading', { state: 'hidden' });
    await expect(page.locator('#finish h4')).toBeVisible();
    await expect(page.locator('#finish h4')).toHaveText('Hello World!');
    
    // Verify start button is now hidden
    await expect(page.locator('#start')).toBeHidden();
  });

  // TC-DYN-002: Dynamic Loading - Element Rendered After the Fact
  test('should render a new element dynamically', async ({ page }) => {
    // Navigate to the dynamic loading example 2
    await page.goto('/dynamic_loading/2');
    
    // Verify initial state
    await expect(page.locator('#start button')).toBeVisible();
    
    // Verify element is not in DOM initially
    const finishElementCount = await page.locator('#finish').count();
    expect(finishElementCount).toBe(0);
    
    // Click the start button
    await page.locator('#start button').click();
    
    // Verify loading indicator appears
    await expect(page.locator('#loading')).toBeVisible();
    
    // Wait for loading to complete
    await page.waitForSelector('#loading', { state: 'hidden' });
    
    // Verify new element is rendered and visible
    await expect(page.locator('#finish')).toBeVisible();
    await expect(page.locator('#finish h4')).toHaveText('Hello World!');
    
    // Verify start button is now hidden
    await expect(page.locator('#start')).toBeHidden();
  });

  // TC-DYN-003: Dynamic Controls - Checkbox
  test('should dynamically remove and add a checkbox', async ({ page }) => {
    // Navigate to dynamic controls page
    await page.goto('/dynamic_controls');
    
    // Verify initial state
    await expect(page.locator('#checkbox')).toBeVisible();
    await expect(page.locator('#checkbox-example button')).toHaveText('Remove');
    
    // Click Remove button
    await page.locator('#checkbox-example button').click();
    
    // Verify loading indicator appears
    await expect(page.locator('#loading')).toBeVisible();
    
    // Wait for loading to complete
    await page.waitForSelector('#loading', { state: 'hidden' });
    
    // Verify checkbox is removed and message is displayed
    await expect(page.locator('#checkbox')).not.toBeVisible();
    await expect(page.locator('#message')).toHaveText("It's gone!");
    await expect(page.locator('#checkbox-example button')).toHaveText('Add');
    
    // Click Add button
    await page.locator('#checkbox-example button').click();
    
    // Verify loading indicator appears again
    await expect(page.locator('#loading')).toBeVisible();
    
    // Wait for loading to complete
    await page.waitForSelector('#loading', { state: 'hidden' });
    
    // Verify checkbox is added back and message is updated
    await expect(page.locator('#checkbox')).toBeVisible();
    await expect(page.locator('#message')).toHaveText("It's back!");
    await expect(page.locator('#checkbox-example button')).toHaveText('Remove');
  });

  // TC-DYN-004: Dynamic Controls - Enable/Disable Input
  test('should dynamically enable and disable an input field', async ({ page }) => {
    // Navigate to dynamic controls page
    await page.goto('/dynamic_controls');
    
    // Verify initial state
    const inputField = page.locator('#input-example input');
    await expect(inputField).toBeDisabled();
    await expect(page.locator('#input-example button')).toHaveText('Enable');
    
    // Click Enable button
    await page.locator('#input-example button').click();
    
    // Verify loading indicator appears
    await expect(page.locator('#input-example #loading')).toBeVisible();
    
    // Wait for loading to complete
    await page.waitForSelector('#input-example #loading', { state: 'hidden' });
    
    // Verify input field is enabled and message is displayed
    await expect(inputField).toBeEnabled();
    await expect(page.locator('#input-example #message')).toHaveText("It's enabled!");
    await expect(page.locator('#input-example button')).toHaveText('Disable');
    
    // Try typing in the enabled input field
    await inputField.fill('Now I can type');
    await expect(inputField).toHaveValue('Now I can type');
    
    // Click Disable button
    await page.locator('#input-example button').click();
    
    // Verify loading indicator appears again
    await expect(page.locator('#input-example #loading')).toBeVisible();
    
    // Wait for loading to complete
    await page.waitForSelector('#input-example #loading', { state: 'hidden' });
    
    // Verify input field is disabled again and message is updated
    await expect(inputField).toBeDisabled();
    await expect(page.locator('#input-example #message')).toHaveText("It's disabled!");
    await expect(page.locator('#input-example button')).toHaveText('Enable');
  });

  // TC-DYN-005: Dynamic Content - Text and Images Change on Reload
  test('should change content on page reload', async ({ page }) => {
    // Navigate to dynamic content page
    await page.goto('/dynamic_content');
    
    // Record the initial state of the content
    const initialTextContent = await page.locator('.row .large-10.columns').allTextContents();
    const initialImageSrcs = await page.locator('.row .large-2.columns img').evaluateAll(
      imgs => imgs.map(img => img.getAttribute('src'))
    );
    
    // Reload the page
    await page.reload();
    
    // Get the new state of the content
    const newTextContent = await page.locator('.row .large-10.columns').allTextContents();
    const newImageSrcs = await page.locator('.row .large-2.columns img').evaluateAll(
      imgs => imgs.map(img => img.getAttribute('src'))
    );
    
    // Verify that at least some content has changed
    expect(
      initialTextContent.some((text, i) => text !== newTextContent[i]) ||
      initialImageSrcs.some((src, i) => src !== newImageSrcs[i])
    ).toBeTruthy();
    
    // Verify the overall structure remains the same
    expect(initialTextContent.length).toBe(newTextContent.length);
    expect(initialImageSrcs.length).toBe(newImageSrcs.length);
  });

  // TC-DYN-006: Dynamic Content - Static Content Option
  test('should maintain static content across reloads', async ({ page }) => {
    // Navigate to dynamic content page with static content option
    await page.goto('/dynamic_content?with_content=static');
    
    // Record the initial state of the content
    const initialTextContent = await page.locator('.row .large-10.columns').allTextContents();
    const initialImageSrcs = await page.locator('.row .large-2.columns img').evaluateAll(
      imgs => imgs.map(img => img.getAttribute('src'))
    );
    
    // Reload the page
    await page.reload();
    
    // Get the new state of the content
    const newTextContent = await page.locator('.row .large-10.columns').allTextContents();
    const newImageSrcs = await page.locator('.row .large-2.columns img').evaluateAll(
      imgs => imgs.map(img => img.getAttribute('src'))
    );
    
    // Verify that content remains the same
    expect(initialTextContent).toEqual(newTextContent);
    expect(initialImageSrcs).toEqual(newImageSrcs);
  });
});

// Dynamic Content Accessibility Tests
test.describe('Dynamic Content Accessibility', () => {
  // TC-DYN-101: Dynamic Loading Accessibility
  test('dynamically loaded content should be accessible', async ({ page }) => {
    // Navigate to the dynamic loading example 1
    await page.goto('/dynamic_loading/1');
    
    // Run basic accessibility checks
    await expect(page.locator('#start button')).toBeVisible();
    await expect(page.locator('#start button')).not.toBeDisabled();
    
    // Check keyboard accessibility
    await page.keyboard.press('Tab');
    const isFocused = await page.evaluate(() => {
      return document.activeElement.tagName === 'BUTTON';
    });
    expect(isFocused).toBeTruthy();
    
    // Trigger the loading with keyboard
    await page.keyboard.press('Enter');
    
    // Wait for loading to complete
    await page.waitForSelector('#loading', { state: 'hidden' });
    
    // Verify dynamically loaded content is perceivable
    await expect(page.locator('#finish h4')).toBeVisible();
    
    // In a real test, we would use accessibility testing libraries
    // For example:
    // const accessibilityViolations = await new AxeBuilder({ page }).analyze();
    // expect(accessibilityViolations.violations).toEqual([]);
  });
});

// Dynamic Content Security Tests
test.describe('Dynamic Content Security', () => {
  // TC-DYN-201: XSS Protection in Dynamic Content
  test('should sanitize dynamic content against XSS', async ({ page }) => {
    // Navigate to dynamic content page
    await page.goto('/dynamic_content');
    
    // Monitor console for any JavaScript errors or alerts
    let jsErrors = [];
    let jsAlerts = [];
    
    page.on('console', msg => {
      if (msg.type() === 'error') {
        jsErrors.push(msg.text());
      }
    });
    
    page.on('dialog', async dialog => {
      jsAlerts.push(dialog.message());
      await dialog.dismiss();
    });
    
    // Inspect the content to ensure no script execution
    const hasScriptTag = await page.evaluate(() => {
      const content = document.querySelector('.row .large-10.columns');
      return content && content.innerHTML.includes('<script>');
    });
    
    // Verify no script tags in content
    expect(hasScriptTag).toBeFalsy();
    
    // Verify no JavaScript errors or alerts occurred
    expect(jsErrors.length).toBe(0);
    expect(jsAlerts.length).toBe(0);
  });
});

// Dynamic Content Performance Tests
test.describe('Dynamic Content Performance', () => {
  // TC-DYN-301: Dynamic Loading Performance
  test('dynamic loading should complete within acceptable time', async ({ page }) => {
    // Measure initial page load time
    const startPageLoad = Date.now();
    await page.goto('/dynamic_loading/1');
    const pageLoadTime = Date.now() - startPageLoad;
    
    // Verify page load time is within acceptable limits
    expect(pageLoadTime).toBeLessThan(3000); // 3 seconds
    
    // Measure dynamic loading time
    await page.locator('#start button').click();
    
    const startLoading = Date.now();
    
    // Wait for loading to complete
    await page.waitForSelector('#loading', { state: 'hidden' });
    await expect(page.locator('#finish h4')).toBeVisible();
    
    const loadingTime = Date.now() - startLoading;
    
    // The loading animation is set to approximately 5 seconds
    // So loading time should be approximately 5 seconds ± 500ms
    expect(loadingTime).toBeGreaterThan(4500);
    expect(loadingTime).toBeLessThan(5500);
  });
});

// Edge Cases
test.describe('Dynamic Content Edge Cases', () => {
  // TC-DYN-402: Rapid Repeated Dynamic Control Operations
  test('should handle rapid toggle operations', async ({ page }) => {
    // Navigate to dynamic controls page
    await page.goto('/dynamic_controls');
    
    // Verify initial state
    await expect(page.locator('#checkbox')).toBeVisible();
    
    // Click Remove button
    await page.locator('#checkbox-example button').click();
    
    // Immediately click Add button after it appears
    // We need to wait for the button text to change to "Add"
    await page.waitForFunction(() => {
      const button = document.querySelector('#checkbox-example button');
      return button && button.textContent.trim() === 'Add';
    });
    
    // Click Add button immediately
    await page.locator('#checkbox-example button').click();
    
    // Wait for the operation to complete
    await page.waitForSelector('#loading', { state: 'hidden' });
    
    // Verify final state (checkbox should be back)
    await expect(page.locator('#checkbox')).toBeVisible();
    await expect(page.locator('#message')).toHaveText("It's back!");
    
    // Do the same for Enable/Disable
    // Click Enable button
    await page.locator('#input-example button').click();
    
    // Immediately click Disable button after it appears
    await page.waitForFunction(() => {
      const button = document.querySelector('#input-example button');
      return button && button.textContent.trim() === 'Disable';
    });
    
    // Click Disable button immediately
    await page.locator('#input-example button').click();
    
    // Wait for the operation to complete
    await page.waitForSelector('#input-example #loading', { state: 'hidden' });
    
    // Verify final state (input should be disabled)
    await expect(page.locator('#input-example input')).toBeDisabled();
    await expect(page.locator('#input-example #message')).toHaveText("It's disabled!");
  });
});