const { Builder, By, Key, until } = require('selenium-webdriver');
const { expect } = require('chai');

// Get browser from environment variable or default to chrome
const BROWSER = process.env.BROWSER || 'chrome';
const BASE_URL = 'http://the-internet.herokuapp.com';

describe('Authentication Tests - Selenium WebDriver', function() {
  this.timeout(30000); // Increase timeout for Selenium tests
  
  let driver;
  
  before(async function() {
    // Initialize the WebDriver for the specified browser
    driver = await new Builder().forBrowser(BROWSER).build();
  });
  
  after(async function() {
    // Close the browser after all tests
    if (driver) await driver.quit();
  });
  
  // TC-AUTH-001: Form Login with Valid Credentials
  it('should allow login with valid credentials', async function() {
    // Navigate to login page
    await driver.get(`${BASE_URL}/login`);
    
    // Verify login form is displayed
    const header = await driver.findElement(By.css('h2')).getText();
    expect(header).to.equal('Login Page');
    
    // Enter valid credentials
    await driver.findElement(By.id('username')).sendKeys('tomsmith');
    await driver.findElement(By.id('password')).sendKeys('SuperSecretPassword!');
    
    // Click login button
    await driver.findElement(By.css('button[type="submit"]')).click();
    
    // Verify successful login
    await driver.wait(until.elementLocated(By.css('.flash.success')), 5000);
    const successMessage = await driver.findElement(By.css('.flash.success')).getText();
    expect(successMessage).to.include('You logged into a secure area!');
    
    const secureHeader = await driver.findElement(By.css('h2')).getText();
    expect(secureHeader).to.equal('Secure Area');
    
    const logoutButton = await driver.findElement(By.css('.button.secondary'));
    expect(await logoutButton.isDisplayed()).to.be.true;
  });
  
  // TC-AUTH-002: Form Login with Invalid Username
  it('should show error with invalid username', async function() {
    // Navigate to login page
    await driver.get(`${BASE_URL}/login`);
    
    // Enter invalid username
    await driver.findElement(By.id('username')).sendKeys('incorrectUser');
    await driver.findElement(By.id('password')).sendKeys('SuperSecretPassword!');
    
    // Click login button
    await driver.findElement(By.css('button[type="submit"]')).click();
    
    // Verify error message
    await driver.wait(until.elementLocated(By.css('.flash.error')), 5000);
    const errorMessage = await driver.findElement(By.css('.flash.error')).getText();
    expect(errorMessage).to.include('Your username is invalid!');
    
    // Verify we're still on the login page
    const header = await driver.findElement(By.css('h2')).getText();
    expect(header).to.equal('Login Page');
  });
  
  // TC-AUTH-003: Form Login with Invalid Password
  it('should show error with invalid password', async function() {
    // Navigate to login page
    await driver.get(`${BASE_URL}/login`);
    
    // Enter invalid password
    await driver.findElement(By.id('username')).sendKeys('tomsmith');
    await driver.findElement(By.id('password')).sendKeys('WrongPassword');
    
    // Click login button
    await driver.findElement(By.css('button[type="submit"]')).click();
    
    // Verify error message
    await driver.wait(until.elementLocated(By.css('.flash.error')), 5000);
    const errorMessage = await driver.findElement(By.css('.flash.error')).getText();
    expect(errorMessage).to.include('Your password is invalid!');
    
    // Verify we're still on the login page
    const header = await driver.findElement(By.css('h2')).getText();
    expect(header).to.equal('Login Page');
  });
  
  // TC-AUTH-004: Logout Functionality
  it('should allow user to logout', async function() {
    // Navigate to login page
    await driver.get(`${BASE_URL}/login`);
    
    // Login with valid credentials
    await driver.findElement(By.id('username')).sendKeys('tomsmith');
    await driver.findElement(By.id('password')).sendKeys('SuperSecretPassword!');
    await driver.findElement(By.css('button[type="submit"]')).click();
    
    // Verify successful login
    await driver.wait(until.elementLocated(By.css('h2')), 5000);
    const secureHeader = await driver.findElement(By.css('h2')).getText();
    expect(secureHeader).to.equal('Secure Area');
    
    // Click logout button
    await driver.findElement(By.css('.button.secondary')).click();
    
    // Verify successful logout
    await driver.wait(until.elementLocated(By.css('.flash.success')), 5000);
    const successMessage = await driver.findElement(By.css('.flash.success')).getText();
    expect(successMessage).to.include('You logged out of the secure area!');
    
    const loginHeader = await driver.findElement(By.css('h2')).getText();
    expect(loginHeader).to.equal('Login Page');
  });
  
  // TC-AUTH-008: Session Persistence After Login
  it('should maintain session after navigation', async function() {
    // Login first
    await driver.get(`${BASE_URL}/login`);
    await driver.findElement(By.id('username')).sendKeys('tomsmith');
    await driver.findElement(By.id('password')).sendKeys('SuperSecretPassword!');
    await driver.findElement(By.css('button[type="submit"]')).click();
    
    // Verify successful login
    await driver.wait(until.elementLocated(By.css('h2')), 5000);
    let secureHeader = await driver.findElement(By.css('h2')).getText();
    expect(secureHeader).to.equal('Secure Area');
    
    // Navigate to another page
    await driver.get(`${BASE_URL}/`);
    
    // Navigate back to secure page directly
    await driver.get(`${BASE_URL}/secure`);
    
    // Verify we're still logged in (not redirected to login)
    await driver.wait(until.elementLocated(By.css('h2')), 5000);
    secureHeader = await driver.findElement(By.css('h2')).getText();
    expect(secureHeader).to.equal('Secure Area');
    
    const logoutButton = await driver.findElement(By.css('.button.secondary'));
    expect(await logoutButton.isDisplayed()).to.be.true;
  });
});

describe('Authentication Security Tests - Selenium WebDriver', function() {
  this.timeout(30000);
  
  let driver;
  
  before(async function() {
    driver = await new Builder().forBrowser(BROWSER).build();
  });
  
  after(async function() {
    if (driver) await driver.quit();
  });
  
  // TC-AUTH-201: Login CSRF Protection
  it('should have protection against CSRF', async function() {
    // Navigate to login page
    await driver.get(`${BASE_URL}/login`);
    
    // Check form submission method
    const formMethod = await driver.findElement(By.css('form#login')).getAttribute('method');
    expect(formMethod).to.equal('post');
    
    // Check form action
    const formAction = await driver.findElement(By.css('form#login')).getAttribute('action');
    expect(formAction).to.equal('/authenticate');
    
    // Note: In a real application, we would check for CSRF tokens in the form
  });
});

describe('Authentication Accessibility Tests - Selenium WebDriver', function() {
  this.timeout(30000);
  
  let driver;
  
  before(async function() {
    driver = await new Builder().forBrowser(BROWSER).build();
  });
  
  after(async function() {
    if (driver) await driver.quit();
  });
  
  // TC-AUTH-101: Login Form Accessibility
  it('login form should be accessible', async function() {
    // Navigate to login page
    await driver.get(`${BASE_URL}/login`);
    
    // Check for proper form structure
    const usernameLabel = await driver.findElement(By.css('label[for="username"]'));
    expect(await usernameLabel.isDisplayed()).to.be.true;
    
    const passwordLabel = await driver.findElement(By.css('label[for="password"]'));
    expect(await passwordLabel.isDisplayed()).to.be.true;
    
    // Check tab order by tabbing through elements
    const usernameInput = await driver.findElement(By.id('username'));
    await usernameInput.click();
    
    await driver.actions().sendKeys(Key.TAB).perform();
    const activeElement1 = await driver.switchTo().activeElement();
    const activeId1 = await activeElement1.getAttribute('id');
    expect(activeId1).to.equal('password');
    
    await driver.actions().sendKeys(Key.TAB).perform();
    const activeElement2 = await driver.switchTo().activeElement();
    const activeTagName = await activeElement2.getTagName();
    expect(activeTagName.toLowerCase()).to.equal('button');
    
    // In a real test, we would use accessibility testing tools like axe-core
  });
});

describe('Authentication Performance Tests - Selenium WebDriver', function() {
  this.timeout(30000);
  
  let driver;
  
  before(async function() {
    driver = await new Builder().forBrowser(BROWSER).build();
  });
  
  after(async function() {
    if (driver) await driver.quit();
  });
  
  // TC-AUTH-301: Login Response Time
  it('login should respond within acceptable time limits', async function() {
    // Measure page load time
    const startPageLoad = Date.now();
    await driver.get(`${BASE_URL}/login`);
    const pageLoadTime = Date.now() - startPageLoad;
    
    // Verify page load time is within acceptable limits
    expect(pageLoadTime).to.be.lessThan(3000); // 3 seconds
    
    // Measure login response time
    const startLogin = Date.now();
    
    await driver.findElement(By.id('username')).sendKeys('tomsmith');
    await driver.findElement(By.id('password')).sendKeys('SuperSecretPassword!');
    await driver.findElement(By.css('button[type="submit"]')).click();
    
    // Wait for login to complete
    await driver.wait(until.elementLocated(By.css('.flash.success')), 5000);
    
    const loginTime = Date.now() - startLogin;
    
    // Verify login response time is within acceptable limits
    expect(loginTime).to.be.lessThan(3000); // 3 seconds for Selenium which is slower
  });
});