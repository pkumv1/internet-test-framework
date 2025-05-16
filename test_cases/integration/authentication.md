# Authentication Test Cases

This document contains test cases for the authentication features of The Internet application.

## Test Case Categories

The authentication module tests include Form Authentication, Basic Auth, and Digest Authentication.

## Test Cases

### TC-AUTH-001: Form Login with Valid Credentials

**Description:** Verify that a user can successfully log in with valid credentials.

**Test Type:** Functional, Integration

**Priority:** High

**Preconditions:**
- The Internet application is accessible
- User has valid credentials (username: tomsmith, password: SuperSecretPassword!)

**Test Steps:**
1. Navigate to http://the-internet.herokuapp.com/login
2. Enter username "tomsmith" in the username field
3. Enter password "SuperSecretPassword!" in the password field
4. Click the Login button

**Expected Results:**
- User is redirected to the secure area page
- Success message "You logged into a secure area!" is displayed
- Logout button is available

### TC-AUTH-002: Form Login with Invalid Username

**Description:** Verify system behavior when logging in with an invalid username.

**Test Type:** Functional, Negative

**Priority:** High

**Preconditions:**
- The Internet application is accessible

**Test Steps:**
1. Navigate to http://the-internet.herokuapp.com/login
2. Enter invalid username "incorrectUser" in the username field
3. Enter valid password "SuperSecretPassword!" in the password field
4. Click the Login button

**Expected Results:**
- Login is unsuccessful
- Error message "Your username is invalid!" is displayed
- User remains on the login page

### TC-AUTH-003: Form Login with Invalid Password

**Description:** Verify system behavior when logging in with an invalid password.

**Test Type:** Functional, Negative

**Priority:** High

**Preconditions:**
- The Internet application is accessible

**Test Steps:**
1. Navigate to http://the-internet.herokuapp.com/login
2. Enter valid username "tomsmith" in the username field
3. Enter invalid password "WrongPassword" in the password field
4. Click the Login button

**Expected Results:**
- Login is unsuccessful
- Error message "Your password is invalid!" is displayed
- User remains on the login page

### TC-AUTH-004: Logout Functionality

**Description:** Verify that a user can successfully log out after logging in.

**Test Type:** Functional, Integration

**Priority:** High

**Preconditions:**
- The Internet application is accessible
- User is logged in with valid credentials

**Test Steps:**
1. Navigate to http://the-internet.herokuapp.com/login
2. Log in with valid credentials (username: tomsmith, password: SuperSecretPassword!)
3. Verify the user is on the secure area page
4. Click the Logout button

**Expected Results:**
- User is redirected to the login page
- Success message "You logged out of the secure area!" is displayed

### TC-AUTH-005: Basic Authentication with Valid Credentials

**Description:** Verify that a user can access a page protected by Basic Authentication using valid credentials.

**Test Type:** Functional, Security

**Priority:** Medium

**Preconditions:**
- The Internet application is accessible
- User has valid credentials for Basic Auth (username: admin, password: admin)

**Test Steps:**
1. Navigate to http://the-internet.herokuapp.com/basic_auth with credentials admin:admin
   (Either by using browser authentication handling or direct URL format: http://admin:admin@the-internet.herokuapp.com/basic_auth)

**Expected Results:**
- Page content is accessible
- Success message "Congratulations! You must have the proper credentials." is displayed

### TC-AUTH-006: Basic Authentication with Invalid Credentials

**Description:** Verify system behavior when accessing a Basic Auth protected page with invalid credentials.

**Test Type:** Functional, Security, Negative

**Priority:** Medium

**Preconditions:**
- The Internet application is accessible

**Test Steps:**
1. Attempt to navigate to http://the-internet.herokuapp.com/basic_auth with invalid credentials

**Expected Results:**
- Access is denied
- Browser shows authentication challenge dialog again
- Page content is not accessible

### TC-AUTH-007: Digest Authentication with Valid Credentials

**Description:** Verify that a user can access a page protected by Digest Authentication using valid credentials.

**Test Type:** Functional, Security

**Priority:** Medium

**Preconditions:**
- The Internet application is accessible
- User has valid credentials for Digest Auth (username: admin, password: admin)

**Test Steps:**
1. Navigate to http://the-internet.herokuapp.com/digest_auth with credentials admin:admin
   (Either by using browser authentication handling or appropriate auth mechanism in test tools)

**Expected Results:**
- Page content is accessible
- Success message "Congratulations! You must have the proper credentials." is displayed

### TC-AUTH-008: Session Persistence After Login

**Description:** Verify that the user's session persists after successful login.

**Test Type:** Functional, Security

**Priority:** Medium

**Preconditions:**
- The Internet application is accessible
- User has valid credentials

**Test Steps:**
1. Navigate to http://the-internet.herokuapp.com/login
2. Log in with valid credentials (username: tomsmith, password: SuperSecretPassword!)
3. Navigate to another page within the application
4. Return to the secure area page directly (http://the-internet.herokuapp.com/secure)

**Expected Results:**
- User is still authenticated and can access the secure area
- No re-authentication is required

## Accessibility Testing

### TC-AUTH-101: Login Form Accessibility

**Description:** Verify that the login form meets WCAG 2.1 AA accessibility standards.

**Test Type:** Accessibility

**Priority:** Medium

**Preconditions:**
- The Internet application is accessible

**Test Steps:**
1. Navigate to http://the-internet.herokuapp.com/login
2. Run automated accessibility testing tool (axe-core)
3. Manually verify keyboard navigation through login form elements

**Expected Results:**
- No critical accessibility issues found
- Form elements have appropriate labels
- Form elements can be navigated by keyboard
- Error messages are properly associated with form fields

## Security Testing

### TC-AUTH-201: Login CSRF Protection

**Description:** Verify that the login form has protection against Cross-Site Request Forgery (CSRF).

**Test Type:** Security

**Priority:** High

**Preconditions:**
- The Internet application is accessible

**Test Steps:**
1. Navigate to http://the-internet.herokuapp.com/login
2. Inspect the login form for CSRF tokens or other protections
3. Attempt to submit the form from another origin

**Expected Results:**
- Login form has CSRF protection mechanisms
- Login attempts from unauthorized origins are rejected

### TC-AUTH-202: Login Credentials Encryption

**Description:** Verify that login credentials are transmitted securely.

**Test Type:** Security

**Priority:** High

**Preconditions:**
- The Internet application is accessible

**Test Steps:**
1. Open browser developer tools and navigate to the Network tab
2. Navigate to http://the-internet.herokuapp.com/login
3. Submit valid login credentials
4. Examine the network request for the login form submission

**Expected Results:**
- Credentials are sent over HTTPS (if available)
- Password is not visible in plaintext in the requests

## Performance Testing

### TC-AUTH-301: Login Response Time

**Description:** Verify the response time of the login functionality.

**Test Type:** Performance

**Priority:** Medium

**Preconditions:**
- The Internet application is accessible

**Test Steps:**
1. Navigate to http://the-internet.herokuapp.com/login
2. Measure the page load time
3. Enter valid credentials and click Login
4. Measure the response time for authentication

**Expected Results:**
- Login page loads within acceptable time limits (< 3 seconds)
- Authentication process completes within acceptable time limits (< 2 seconds)
- No significant UI delays during the login process