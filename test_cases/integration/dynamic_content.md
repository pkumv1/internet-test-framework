# Dynamic Content Test Cases

This document contains test cases for the dynamic content features of The Internet application.

## Test Case Categories

The dynamic content module tests include Dynamic Loading, Dynamic Controls, and Content Changes on reload.

## Test Cases

### TC-DYN-001: Dynamic Loading - Element Hidden

**Description:** Verify functionality of dynamically loading a hidden element.

**Test Type:** Functional, Integration

**Priority:** High

**Preconditions:**
- The Internet application is accessible

**Test Steps:**
1. Navigate to http://the-internet.herokuapp.com/dynamic_loading/1
2. Verify the initial state (Start button visible, hidden element not visible)
3. Click the Start button
4. Wait for the loading indicator to disappear
5. Verify the hidden element becomes visible

**Expected Results:**
- Loading indicator appears after clicking Start button
- Loading indicator disappears after approximately 5 seconds
- Previously hidden "Hello World!" text becomes visible
- Start button is no longer visible

### TC-DYN-002: Dynamic Loading - Element Rendered After the Fact

**Description:** Verify functionality of dynamically rendering an element that wasn't previously in the DOM.

**Test Type:** Functional, Integration

**Priority:** High

**Preconditions:**
- The Internet application is accessible

**Test Steps:**
1. Navigate to http://the-internet.herokuapp.com/dynamic_loading/2
2. Verify the initial state (Start button visible, target element not present in DOM)
3. Click the Start button
4. Wait for the loading indicator to disappear
5. Verify the new element is rendered and visible

**Expected Results:**
- Loading indicator appears after clicking Start button
- Loading indicator disappears after approximately 5 seconds
- "Hello World!" text is rendered and becomes visible
- Start button is no longer visible

### TC-DYN-003: Dynamic Controls - Checkbox

**Description:** Verify the dynamic removal and addition of a checkbox element.

**Test Type:** Functional, UI

**Priority:** Medium

**Preconditions:**
- The Internet application is accessible

**Test Steps:**
1. Navigate to http://the-internet.herokuapp.com/dynamic_controls
2. Verify the initial state (checkbox is present, Remove button is visible)
3. Click the Remove button
4. Wait for the loading indicator to disappear
5. Verify the checkbox is removed and a message is displayed
6. Click the Add button
7. Wait for the loading indicator to disappear
8. Verify the checkbox is added back

**Expected Results:**
- Checkbox is initially visible
- Loading indicator appears after clicking Remove button
- Checkbox disappears after loading
- "It's gone!" message is displayed
- Add button appears in place of the Remove button
- Loading indicator appears after clicking Add button
- Checkbox reappears after loading
- "It's back!" message is displayed
- Remove button appears in place of the Add button

### TC-DYN-004: Dynamic Controls - Enable/Disable Input

**Description:** Verify the dynamic enabling and disabling of an input field.

**Test Type:** Functional, UI

**Priority:** Medium

**Preconditions:**
- The Internet application is accessible

**Test Steps:**
1. Navigate to http://the-internet.herokuapp.com/dynamic_controls
2. Verify the initial state (input field is disabled, Enable button is visible)
3. Click the Enable button
4. Wait for the loading indicator to disappear
5. Verify the input field is enabled and a message is displayed
6. Click the Disable button
7. Wait for the loading indicator to disappear
8. Verify the input field is disabled again

**Expected Results:**
- Input field is initially disabled
- Loading indicator appears after clicking Enable button
- Input field becomes enabled after loading
- "It's enabled!" message is displayed
- Disable button appears in place of the Enable button
- Loading indicator appears after clicking Disable button
- Input field becomes disabled after loading
- "It's disabled!" message is displayed
- Enable button appears in place of the Disable button

### TC-DYN-005: Dynamic Content - Text and Images Change on Reload

**Description:** Verify that text and images change on page reload.

**Test Type:** Functional

**Priority:** Medium

**Preconditions:**
- The Internet application is accessible

**Test Steps:**
1. Navigate to http://the-internet.herokuapp.com/dynamic_content
2. Record the current state of text and images
3. Reload the page
4. Compare the new state with the previous state

**Expected Results:**
- Text content changes after page reload
- Avatar images change after page reload
- The overall structure of the page remains the same

### TC-DYN-006: Dynamic Content - Static Content Option

**Description:** Verify that the static content option maintains consistency across reloads.

**Test Type:** Functional

**Priority:** Low

**Preconditions:**
- The Internet application is accessible

**Test Steps:**
1. Navigate to http://the-internet.herokuapp.com/dynamic_content?with_content=static
2. Record the current state of text and images
3. Reload the page
4. Compare the new state with the previous state

**Expected Results:**
- Text content remains the same after page reload
- Avatar images remain the same after page reload
- The overall structure of the page remains the same

## Accessibility Testing

### TC-DYN-101: Dynamic Loading Accessibility

**Description:** Verify that dynamically loaded content is accessible.

**Test Type:** Accessibility

**Priority:** Medium

**Preconditions:**
- The Internet application is accessible

**Test Steps:**
1. Navigate to http://the-internet.herokuapp.com/dynamic_loading/1
2. Run automated accessibility testing tool (axe-core)
3. Click the Start button and wait for content to load
4. Run automated accessibility testing tool again
5. Verify keyboard accessibility throughout the process

**Expected Results:**
- No critical accessibility issues found
- Loading indicator provides adequate visual feedback
- Dynamically loaded content is announced to screen readers
- All interactive elements are keyboard accessible

## Security Testing

### TC-DYN-201: XSS Protection in Dynamic Content

**Description:** Verify protection against XSS in dynamically loaded content.

**Test Type:** Security

**Priority:** High

**Preconditions:**
- The Internet application is accessible

**Test Steps:**
1. Navigate to http://the-internet.herokuapp.com/dynamic_content
2. Inspect the network calls for content loading
3. Analyze if the content is properly sanitized before rendering

**Expected Results:**
- Content is properly sanitized against XSS attacks
- No client-side JavaScript is executed from dynamic content

## Performance Testing

### TC-DYN-301: Dynamic Loading Performance

**Description:** Verify the performance of dynamically loading content.

**Test Type:** Performance

**Priority:** Medium

**Preconditions:**
- The Internet application is accessible

**Test Steps:**
1. Navigate to http://the-internet.herokuapp.com/dynamic_loading/1
2. Measure the page load time
3. Click the Start button
4. Measure the time from click to content appearance
5. Analyze network traffic during the loading process

**Expected Results:**
- Initial page loads within acceptable time limits (< 3 seconds)
- Content loads within the expected timeframe (approximately 5 seconds)
- No excessive network calls or resource loading during the process
- UI remains responsive during loading

### TC-DYN-302: Dynamic Content Loading Under Network Throttling

**Description:** Verify behavior of dynamic content loading under poor network conditions.

**Test Type:** Performance, Resilience

**Priority:** Low

**Preconditions:**
- The Internet application is accessible
- Network throttling is enabled (e.g., 3G simulation)

**Test Steps:**
1. Enable network throttling in the browser
2. Navigate to http://the-internet.herokuapp.com/dynamic_loading/1
3. Click the Start button
4. Observe loading behavior under throttled conditions

**Expected Results:**
- Loading indicator properly displays even under poor network conditions
- Content eventually loads successfully
- No UI freezing or unresponsiveness during extended loading time
- No JavaScript errors in console

## Edge Cases

### TC-DYN-401: Multiple Simultaneous Dynamic Loads

**Description:** Verify application behavior when triggering multiple dynamic loading processes simultaneously.

**Test Type:** Edge Case, Stress

**Priority:** Low

**Preconditions:**
- The Internet application is accessible

**Test Steps:**
1. Open http://the-internet.herokuapp.com/dynamic_loading/1 in one tab
2. Open http://the-internet.herokuapp.com/dynamic_loading/2 in another tab
3. Click Start button in both tabs in quick succession
4. Observe the behavior of both loading processes

**Expected Results:**
- Both loading processes proceed independently
- Both loading indicators display correctly
- Both pieces of content load successfully
- No JavaScript errors or unexpected behavior

### TC-DYN-402: Rapid Repeated Dynamic Control Operations

**Description:** Verify application behavior when rapidly toggling dynamic controls.

**Test Type:** Edge Case, Stress

**Priority:** Low

**Preconditions:**
- The Internet application is accessible

**Test Steps:**
1. Navigate to http://the-internet.herokuapp.com/dynamic_controls
2. Click the Remove button
3. Immediately after the loading indicator appears, click the Add button (which will appear after loading)
4. Repeat this rapid toggling several times
5. Similarly test with the Enable/Disable buttons

**Expected Results:**
- Application handles rapid sequential operations gracefully
- No UI glitches or JavaScript errors
- Loading indicators behave correctly
- Controls eventually reach a stable state corresponding to the last button click