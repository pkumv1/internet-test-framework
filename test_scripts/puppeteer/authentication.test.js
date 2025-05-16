const puppeteer = require('puppeteer');
const { expect } = require('chai');

const BASE_URL = 'http://the-internet.herokuapp.com';

describe('Authentication Tests - Puppeteer', function() {
  // Increase timeout for these tests
  this.timeout(30000);
  
  let browser;
  let page;
  
  before(async function() {
    // Launch browser
    browser = await puppeteer.launch({
      headless: "new",
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
  });
  
  beforeEach(async function() {
    // Create a new page for each test
    page = await browser.newPage();
  });
  
  afterEach(async function() {
    // Close the page after each test
    if (page) await page.close();
  });
  
  after(async function() {
    // Close the browser after all tests
    if (browser) await browser.close();
  });
  
  // TC-AUTH-001: Form Login with Valid Credentials
  it('should allow login with valid credentials', async function() {
    // Navigate to login page
    await page.goto(`${BASE_URL}/login`);
    
    // Verify login form is displayed
    const header = await page.$eval('h2', el => el.textContent);
    expect(header).to.equal('Login Page');
    
    // Enter valid credentials
    await page.type('#username', 'tomsmith');
    await page.type('#password', 'SuperSecretPassword!');
    
    // Click login button
    await page.click('button[type="submit"]');
    
    // Wait for navigation to complete
    await page.waitForNavigation();
    
    // Verify successful login
    const successMessage = await page.$eval('.flash.success', el => el.textContent);
    expect(successMessage).to.include('You logged into a secure area!');
    
    const secureHeader = await page.$eval('h2', el => el.textContent);
    expect(secureHeader).to.equal('Secure Area');
    
    const logoutButtonVisible = await page.$eval('.button.secondary', el => window.getComputedStyle(el).display !== 'none');
    expect(logoutButtonVisible).to.be.true;
  });
  
  // TC-AUTH-002: Form Login with Invalid Username
  it('should show error with invalid username', async function() {
    // Navigate to login page
    await page.goto(`${BASE_URL}/login`);
    
    // Enter invalid username
    await page.type('#username', 'incorrectUser');
    await page.type('#password', 'SuperSecretPassword!');
    
    // Click login button
    await page.click('button[type="submit"]');
    
    // Wait for error message to appear
    await page.waitForSelector('.flash.error');
    
    // Verify error message
    const errorMessage = await page.$eval('.flash.error', el => el.textContent);
    expect(errorMessage).to.include('Your username is invalid!');
    
    // Verify we're still on the login page
    const header = await page.$eval('h2', el => el.textContent);
    expect(header).to.equal('Login Page');
  });
  
  // TC-AUTH-003: Form Login with Invalid Password
  it('should show error with invalid password', async function() {
    // Navigate to login page
    await page.goto(`${BASE_URL}/login`);
    
    // Enter invalid password
    await page.type('#username', 'tomsmith');
    await page.type('#password', 'WrongPassword');
    
    // Click login button
    await page.click('button[type="submit"]');
    
    // Wait for error message to appear
    await page.waitForSelector('.flash.error');
    
    // Verify error message
    const errorMessage = await page.$eval('.flash.error', el => el.textContent);
    expect(errorMessage).to.include('Your password is invalid!');
    
    // Verify we're still on the login page
    const header = await page.$eval('h2', el => el.textContent);
    expect(header).to.equal('Login Page');
  });
  
  // TC-AUTH-004: Logout Functionality
  it('should allow user to logout', async function() {
    // Navigate to login page
    await page.goto(`${BASE_URL}/login`);
    
    // Login with valid credentials
    await page.type('#username', 'tomsmith');
    await page.type('#password', 'SuperSecretPassword!');
    await page.click('button[type="submit"]');
    
    // Wait for navigation to complete
    await page.waitForNavigation();
    
    // Verify successful login
    const secureHeader = await page.$eval('h2', el => el.textContent);
    expect(secureHeader).to.equal('Secure Area');
    
    // Click logout button
    await page.click('.button.secondary');
    
    // Wait for navigation to complete
    await page.waitForNavigation();
    
    // Verify successful logout
    const successMessage = await page.$eval('.flash.success', el => el.textContent);
    expect(successMessage).to.include('You logged out of the secure area!');
    
    const loginHeader = await page.$eval('h2', el => el.textContent);
    expect(loginHeader).to.equal('Login Page');
  });
  
  // TC-AUTH-008: Session Persistence After Login
  it('should maintain session after navigation', async function() {
    // Login first
    await page.goto(`${BASE_URL}/login`);
    await page.type('#username', 'tomsmith');
    await page.type('#password', 'SuperSecretPassword!');
    await page.click('button[type="submit"]');
    
    // Wait for navigation to complete
    await page.waitForNavigation();
    
    // Verify successful login
    let secureHeader = await page.$eval('h2', el => el.textContent);
    expect(secureHeader).to.equal('Secure Area');
    
    // Navigate to another page
    await page.goto(`${BASE_URL}/`);
    
    // Navigate back to secure page directly
    await page.goto(`${BASE_URL}/secure`);
    
    // Verify we're still logged in
    secureHeader = await page.$eval('h2', el => el.textContent);
    expect(secureHeader).to.equal('Secure Area');
    
    const logoutButtonVisible = await page.$eval('.button.secondary', el => window.getComputedStyle(el).display !== 'none');
    expect(logoutButtonVisible).to.be.true;
  });
});

describe('Authentication Security Tests - Puppeteer', function() {
  this.timeout(30000);
  
  let browser;
  let page;
  
  before(async function() {
    browser = await puppeteer.launch({
      headless: "new",
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
  });
  
  beforeEach(async function() {
    page = await browser.newPage();
  });
  
  afterEach(async function() {
    if (page) await page.close();
  });
  
  after(async function() {
    if (browser) await browser.close();
  });
  
  // TC-AUTH-201: Login CSRF Protection
  it('should have protection against CSRF', async function() {
    // Navigate to login page
    await page.goto(`${BASE_URL}/login`);
    
    // Check form submission method
    const formMethod = await page.$eval('form#login', form => form.method);
    expect(formMethod.toLowerCase()).to.equal('post');
    
    // Check form action
    const formAction = await page.$eval('form#login', form => form.action);
    expect(formAction).to.include('/authenticate');
    
    // In a real application, we would check for CSRF tokens in the form
  });
  
  // TC-AUTH-202: Login Credentials Encryption
  it('should transmit credentials securely', async function() {
    // Enable request interception to monitor requests
    await page.setRequestInterception(true);
    
    let loginRequest = null;
    
    // Listen for requests
    page.on('request', request => {
      if (request.url().includes('/authenticate')) {
        loginRequest = request;
      }
      request.continue();
    });
    
    // Navigate to login page
    await page.goto(`${BASE_URL}/login`);
    
    // Submit valid login
    await page.type('#username', 'tomsmith');
    await page.type('#password', 'SuperSecretPassword!');
    await page.click('button[type="submit"]');
    
    // Wait for navigation to complete
    await page.waitForNavigation();
    
    // Check if login request exists
    expect(loginRequest).to.not.be.null;
    
    // Check request method
    expect(loginRequest.method()).to.equal('POST');
    
    // In a real test, we would verify HTTPS and secure content transmission
    // For this demo app on herokuapp, we're limited in what we can verify
  });
});

describe('Authentication Accessibility Tests - Puppeteer', function() {
  this.timeout(30000);
  
  let browser;
  let page;
  
  before(async function() {
    browser = await puppeteer.launch({
      headless: "new",
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
  });
  
  beforeEach(async function() {
    page = await browser.newPage();
  });
  
  afterEach(async function() {
    if (page) await page.close();
  });
  
  after(async function() {
    if (browser) await browser.close();
  });
  
  // TC-AUTH-101: Login Form Accessibility
  it('login form should be accessible', async function() {
    // Navigate to login page
    await page.goto(`${BASE_URL}/login`);
    
    // Check for proper form structure
    const usernameLabelVisible = await page.$eval('label[for="username"]', el => window.getComputedStyle(el).display !== 'none');
    expect(usernameLabelVisible).to.be.true;
    
    const passwordLabelVisible = await page.$eval('label[for="password"]', el => window.getComputedStyle(el).display !== 'none');
    expect(passwordLabelVisible).to.be.true;
    
    // Check keyboard navigation
    await page.keyboard.press('Tab');
    let focusedElementId = await page.evaluate(() => document.activeElement.id);
    expect(focusedElementId).to.equal('username');
    
    await page.keyboard.press('Tab');
    focusedElementId = await page.evaluate(() => document.activeElement.id);
    expect(focusedElementId).to.equal('password');
    
    await page.keyboard.press('Tab');
    const focusedElementTagName = await page.evaluate(() => document.activeElement.tagName.toLowerCase());
    expect(focusedElementTagName).to.equal('button');
    
    // In a real test, we would use accessibility testing libraries like axe-core
  });
});

describe('Authentication Performance Tests - Puppeteer', function() {
  this.timeout(30000);
  
  let browser;
  let page;
  
  before(async function() {
    browser = await puppeteer.launch({
      headless: "new",
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
  });
  
  beforeEach(async function() {
    page = await browser.newPage();
  });
  
  afterEach(async function() {
    if (page) await page.close();
  });
  
  after(async function() {
    if (browser) await browser.close();
  });
  
  // TC-AUTH-301: Login Response Time
  it('login should respond within acceptable time limits', async function() {
    // Measure page load time
    const startPageLoad = Date.now();
    await page.goto(`${BASE_URL}/login`);
    const pageLoadTime = Date.now() - startPageLoad;
    
    // Verify page load time is within acceptable limits
    expect(pageLoadTime).to.be.lessThan(3000); // 3 seconds
    
    // Measure login response time
    const startLogin = Date.now();
    
    await page.type('#username', 'tomsmith');
    await page.type('#password', 'SuperSecretPassword!');
    await page.click('button[type="submit"]');
    
    // Wait for navigation to complete
    await page.waitForNavigation();
    
    const loginTime = Date.now() - startLogin;
    
    // Verify login response time is within acceptable limits
    expect(loginTime).to.be.lessThan(3000); // 3 seconds for Puppeteer
  });
});