/**
 * Script to run tests with all frameworks and browsers
 */

const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const { generateReport } = require('./generate-report');

// Configure paths
const RESULTS_DIR = path.join(__dirname, '../results');
const REPORTS_DIR = path.join(RESULTS_DIR, 'reports');

// Create necessary directories
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

// Execute a command and return a promise
function execute(command, label) {
  return new Promise((resolve, reject) => {
    console.log(`\n🚀 Running ${label}...`);
    
    const proc = exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`\n❌ Error running ${label}:`, stderr);
        // Still resolve so other tests can run
        resolve({ success: false, output: stderr, error });
        return;
      }
      
      console.log(`\n✅ Completed ${label} successfully!`);
      resolve({ success: true, output: stdout });
    });
    
    // Stream output to console
    proc.stdout.pipe(process.stdout);
    proc.stderr.pipe(process.stderr);
  });
}

// Main function to run all tests
async function runAllTests() {
  // Setup
  console.log('\n📂 Creating results directories...');
  createDirectories();
  
  try {
    // Check if we're in demo mode (no actual test execution)
    const isDemoMode = process.argv.includes('--demo');
    
    if (isDemoMode) {
      console.log('\n🔮 Running in DEMO mode - generating mock results instead of running actual tests');
      
      // Generate mock results
      await execute('node scripts/create-mock-results.js', 'mock result generation');
    } else {
      // Run actual tests
      
      // Run Playwright tests with both browsers
      const playwrightResult = await execute(
        'npx playwright test --browser=chromium,firefox', 
        'Playwright tests'
      );
      
      fs.writeFileSync(
        path.join(REPORTS_DIR, 'playwright-results.txt'), 
        playwrightResult.output || 'Execution failed'
      );
      
      // Run Selenium tests with Chrome
      const seleniumChromeResult = await execute(
        'BROWSER=chrome npx mocha test_scripts/selenium/**/*.test.js',
        'Selenium tests with Chrome'
      );
      
      fs.writeFileSync(
        path.join(REPORTS_DIR, 'selenium-chrome-results.txt'),
        seleniumChromeResult.output || 'Execution failed'
      );
      
      // Run Selenium tests with Firefox
      const seleniumFirefoxResult = await execute(
        'BROWSER=firefox npx mocha test_scripts/selenium/**/*.test.js',
        'Selenium tests with Firefox'
      );
      
      fs.writeFileSync(
        path.join(REPORTS_DIR, 'selenium-firefox-results.txt'),
        seleniumFirefoxResult.output || 'Execution failed'
      );
      
      // Run Puppeteer tests
      const puppeteerResult = await execute(
        'npx mocha test_scripts/puppeteer/**/*.test.js',
        'Puppeteer tests'
      );
      
      fs.writeFileSync(
        path.join(REPORTS_DIR, 'puppeteer-results.txt'),
        puppeteerResult.output || 'Execution failed'
      );
    }
    
    // Generate report
    console.log('\n📊 Generating test reports...');
    await execute('node scripts/generate-report.js', 'report generation');
    
    console.log('\n🏁 All tests completed!');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error running tests:', error);
    process.exit(1);
  }
}

// Start execution if this script is run directly
if (require.main === module) {
  runAllTests();
}

module.exports = { runAllTests };