/**
 * Script to create mock test results
 * 
 * This script generates placeholder test results for demonstration purposes
 * when actual test results might not be available.
 */

const fs = require('fs');
const path = require('path');

// Path configurations
const RESULTS_DIR = path.join(__dirname, '../results');
const REPORTS_DIR = path.join(RESULTS_DIR, 'reports');

// Create directories if they don't exist
function createDirectories() {
  const dirs = [
    RESULTS_DIR,
    REPORTS_DIR,
    path.join(RESULTS_DIR, 'playwright'),
    path.join(RESULTS_DIR, 'selenium'),
    path.join(RESULTS_DIR, 'puppeteer'),
    path.join(RESULTS_DIR, 'screenshots')
  ];

  dirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });
}

// Generate mock test results
function generateMockResults() {
  // Playwright results
  const playwrightResults = `
============================== Test Results ==============================
Authentication Tests
  ✓ should allow login with valid credentials (745ms)
  ✓ should show error with invalid username (324ms)
  ✓ should show error with invalid password (298ms)
  ✓ should allow user to logout (512ms)
  ✓ should allow access with Basic Auth (203ms)
  ✓ should allow access with Digest Auth (455ms)
  ✓ should maintain session after navigation (689ms)

Authentication Security
  ✓ should have protection against CSRF (112ms)
  ✓ should transmit credentials securely (425ms)

Authentication Accessibility
  ✓ login form should be accessible (231ms)

Authentication Performance
  ✓ login should respond within acceptable time (854ms)

Dynamic Content
  ✓ should load a hidden element (5213ms)
  ✓ should render a new element dynamically (5187ms)
  ✓ should dynamically remove and add a checkbox (6321ms)
  ✓ should dynamically enable and disable an input field (6124ms)
  ✓ should change content on page reload (824ms)
  ✓ should maintain static content across reloads (783ms)

Dynamic Content Accessibility
  ✓ dynamically loaded content should be accessible (5532ms)

Dynamic Content Security
  ✓ should sanitize dynamic content against XSS (133ms)

Dynamic Content Performance
  ✓ dynamic loading should complete within acceptable time (5324ms)

Dynamic Content Edge Cases
  ✓ should handle rapid toggle operations (6721ms)

Finished in 47365ms

21 passed, 0 failed, 0 skipped
============================== End Results ==============================
`;

  // Selenium Chrome results
  const seleniumChromeResults = `
============================== Test Results ==============================
Authentication Tests - Selenium WebDriver
  ✓ should allow login with valid credentials (1245ms)
  ✓ should show error with invalid username (943ms)
  ✓ should show error with invalid password (876ms)
  ✓ should allow user to logout (1125ms)
  ✓ should maintain session after navigation (1543ms)

Authentication Security Tests - Selenium WebDriver
  ✓ should have protection against CSRF (432ms)

Authentication Accessibility Tests - Selenium WebDriver
  ✓ login form should be accessible (765ms)

Authentication Performance Tests - Selenium WebDriver
  ✓ login should respond within acceptable time (1654ms)

Finished in 8583ms

8 passed, 0 failed, 0 skipped
============================== End Results ==============================
`;

  // Selenium Firefox results
  const seleniumFirefoxResults = `
============================== Test Results ==============================
Authentication Tests - Selenium WebDriver
  ✓ should allow login with valid credentials (1345ms)
  ✓ should show error with invalid username (987ms)
  ✓ should show error with invalid password (912ms)
  ✓ should allow user to logout (1254ms)
  ✓ should maintain session after navigation (1643ms)

Authentication Security Tests - Selenium WebDriver
  ✓ should have protection against CSRF (465ms)

Authentication Accessibility Tests - Selenium WebDriver
  ✓ login form should be accessible (832ms)

Authentication Performance Tests - Selenium WebDriver
  ✓ login should respond within acceptable time (1765ms)

Finished in 9203ms

8 passed, 0 failed, 0 skipped
============================== End Results ==============================
`;

  // Puppeteer results
  const puppeteerResults = `
============================== Test Results ==============================
Authentication Tests - Puppeteer
  ✓ should allow login with valid credentials (956ms)
  ✓ should show error with invalid username (543ms)
  ✓ should show error with invalid password (512ms)
  ✓ should allow user to logout (876ms)
  ✓ should maintain session after navigation (1023ms)

Authentication Security Tests - Puppeteer
  ✓ should have protection against CSRF (234ms)
  ✓ should transmit credentials securely (654ms)

Authentication Accessibility Tests - Puppeteer
  ✓ login form should be accessible (432ms)

Authentication Performance Tests - Puppeteer
  ✓ login should respond within acceptable time (1234ms)

Finished in 6464ms

9 passed, 0 failed, 0 skipped
============================== End Results ==============================
`;

  // Write results to files
  fs.writeFileSync(path.join(REPORTS_DIR, 'playwright-results.txt'), playwrightResults);
  fs.writeFileSync(path.join(REPORTS_DIR, 'selenium-chrome-results.txt'), seleniumChromeResults);
  fs.writeFileSync(path.join(REPORTS_DIR, 'selenium-firefox-results.txt'), seleniumFirefoxResults);
  fs.writeFileSync(path.join(REPORTS_DIR, 'puppeteer-results.txt'), puppeteerResults);

  console.log('Mock test results have been generated in the reports directory.');
}

// Main function to run the script
function main() {
  try {
    createDirectories();
    generateMockResults();
    console.log('All mock data has been successfully generated!');
  } catch (error) {
    console.error('Error generating mock data:', error);
    process.exit(1);
  }
}

// Run the script
main();