# The Internet Test Framework

A comprehensive multi-framework test suite for [The Internet](http://the-internet.herokuapp.com/) application created by Sauce Labs.

## Overview

This repository contains automated tests for the Sauce Labs demo application "The Internet", which showcases various web elements and interactions that are challenging to automate.

## Repository Structure

- `/test_cases`: Test case specifications categorized by testing type
- `/test_scripts`: Implementations using Playwright, Selenium, and Puppeteer
- `/results`: Test execution results and reports
- `/scripts`: Utility scripts for running tests and generating reports

## Features Tested

This test suite covers all features of The Internet app, including:

- Authentication (login forms, basic auth, digest auth)
- Dynamic elements and loading
- Drag and drop operations
- File uploads and downloads
- Frames and iframes
- Alerts and popups
- Tables and sorting
- And many more challenges

## Testing Approaches

Tests are implemented across several layers:

- Unit Testing: Testing individual components
- Integration Testing: Testing interactions between components
- System Testing: End-to-end functionality testing
- Regression Testing: Ensuring stability across changes
- Performance Testing: Testing under load and stress conditions
- Security Testing: Identifying potential vulnerabilities
- Accessibility Testing: Ensuring WCAG compliance
- Visual Testing: Ensuring visual consistency

## Getting Started

### Prerequisites

- Node.js (version 18 or higher)
- npm or yarn
- Docker (optional for containerized execution)

### Installation

```bash
git clone https://github.com/pkumv1/internet-test-framework.git
cd internet-test-framework
npm install
```

### Running Tests

```bash
# Run all tests
npm test

# Run Playwright tests
npm run test:playwright

# Run Selenium tests
npm run test:selenium

# Run Puppeteer tests
npm run test:puppeteer
```

## Test Results

After test execution, results are available in the `/results` directory in both HTML and PDF formats, including metrics on:

- Test Coverage
- Test Metrics & Analytics
- Risk Assessment
- Test Debt

## License

MIT