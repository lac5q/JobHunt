# Testing Guide
## Job Search CRM with AI Integration

This directory contains User Acceptance Testing (UAT) and automated regression tests.

---

## 📋 UAT Testing

### Manual Testing Checklist

**File**: `UAT-TEST-PLAN.md`

**Purpose**: Comprehensive manual testing checklist to verify all features work correctly from a user perspective.

**When to Run**:
- Before production deployments
- After major feature additions
- After bug fixes affecting critical flows
- Monthly regression testing

**How to Run**:
1. Open `UAT-TEST-PLAN.md`
2. Start with Test Scenario #1
3. Follow each step carefully
4. Check off expected results as you verify them
5. Note any failures or unexpected behavior
6. Calculate pass rate at the end
7. Sign off when complete

**Test Coverage**:
- LinkedIn message sync (3 tests)
- AI message generation (4 tests)
- Error handling & retry logic (3 tests)
- Mobile responsive design (3 tests)
- Message history & analytics (3 tests)
- Data persistence & sync (2 tests)
- Edge cases & boundary conditions (3 tests)

**Total**: 23 manual test cases

---

## 🤖 Automated Regression Tests

### Playwright Test Suite

**File**: `regression-tests.spec.js`

**Purpose**: Automated tests that catch regressions and can run in CI/CD pipelines.

**Prerequisites**:
```bash
# Install Playwright (if not already installed)
npm install --save-dev @playwright/test

# Install browsers
npx playwright install
```

**How to Run**:

```bash
# Run all regression tests
npx playwright test tests/regression-tests.spec.js

# Run in headed mode (see browser)
npx playwright test tests/regression-tests.spec.js --headed

# Run specific test suite
npx playwright test tests/regression-tests.spec.js -g "LinkedIn Message Sync"

# Run with UI mode (interactive)
npx playwright test tests/regression-tests.spec.js --ui

# Generate HTML report
npx playwright test tests/regression-tests.spec.js --reporter=html
npx playwright show-report
```

**Test Coverage**:
- LinkedIn Message Sync (3 tests)
- AI Panel Integration (5 tests)
- Message History & Response Tracking (3 tests)
- Analytics Dashboard (2 tests)
- Mobile Responsive Design (2 tests)
- Data Persistence (1 test)

**Total**: 16 automated tests

---

## 🏃‍♂️ Quick Start

### First Time Setup

```bash
cd /Users/lcalderon/github/JobHunt

# Install dependencies
npm install

# Install Playwright browsers
npx playwright install chromium

# Verify setup
npx playwright test docs/test-playwright.js
```

### Before Each Deploy

```bash
# 1. Run automated tests
npx playwright test tests/regression-tests.spec.js

# 2. If all pass, run UAT checklist
open tests/UAT-TEST-PLAN.md

# 3. If UAT passes, deploy
vercel --prod
```

---

## 📊 Test Results Tracking

### Automated Tests

Playwright generates reports automatically:

```bash
# Run tests with HTML report
npx playwright test tests/regression-tests.spec.js --reporter=html

# View report
npx playwright show-report
```

Report includes:
- Pass/fail status for each test
- Screenshots of failures
- Execution time
- Error traces

### Manual UAT Tests

Track results in `UAT-TEST-PLAN.md`:

1. Check off each expected result as you verify
2. Mark test as Pass/Fail
3. Add notes for any issues
4. Fill in summary section:
   - Total test cases
   - Passed count
   - Failed count
   - Pass rate percentage
5. Document critical issues found
6. Add recommendations
7. Sign off when complete

---

## 🐛 Debugging Failed Tests

### Automated Tests

**View test trace**:
```bash
# Run with trace
npx playwright test tests/regression-tests.spec.js --trace on

# If test fails, view trace
npx playwright show-trace trace.zip
```

**Debug mode**:
```bash
# Run with debugger
npx playwright test tests/regression-tests.spec.js --debug
```

**Visual debugging**:
```bash
# Run in headed mode with slow motion
npx playwright test tests/regression-tests.spec.js --headed --slow-mo=1000
```

### Manual UAT Tests

1. Open browser DevTools (F12)
2. Switch to Console tab
3. Look for JavaScript errors
4. Check Network tab for failed requests
5. Verify localStorage data:
   ```javascript
   // In browser console:
   JSON.parse(localStorage.getItem('jobSearchContacts'))
   JSON.parse(localStorage.getItem('gmailAccounts'))
   ```

---

## 📝 Adding New Tests

### Adding Automated Tests

1. Open `regression-tests.spec.js`
2. Add new test in appropriate `test.describe()` block:

```javascript
test('should do something new', async ({ page }) => {
    // Setup
    await page.goto(`${BASE_URL}/job-search-dashboard.html`);

    // Action
    await page.click('#some-button');

    // Assertion
    await expect(page.locator('#result')).toContainText('Expected');
});
```

3. Run test to verify:
   ```bash
   npx playwright test tests/regression-tests.spec.js -g "should do something new"
   ```

### Adding UAT Tests

1. Open `UAT-TEST-PLAN.md`
2. Add new test scenario following existing format:
   - Objective
   - Prerequisites
   - Steps
   - Expected Results
   - Actual Results checkbox
   - Notes field

---

## 🔄 CI/CD Integration

### GitHub Actions Example

Create `.github/workflows/test.yml`:

```yaml
name: Automated Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - name: Install dependencies
        run: npm ci
      - name: Install Playwright
        run: npx playwright install --with-deps
      - name: Run tests
        run: npx playwright test tests/regression-tests.spec.js
      - name: Upload report
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: playwright-report
          path: playwright-report/
```

---

## 📈 Test Metrics

### Target Metrics

- **Automated Test Pass Rate**: >= 95%
- **UAT Test Pass Rate**: >= 90%
- **Test Execution Time**: < 2 minutes (automated)
- **Manual UAT Time**: < 45 minutes
- **Code Coverage**: >= 80% (future goal)

### Current Status

**Automated Tests**:
- Total: 16 tests
- Pass Rate: [Run tests to determine]
- Last Run: [Date]

**UAT Tests**:
- Total: 23 tests
- Pass Rate: [Complete UAT to determine]
- Last Run: [Date]

---

## 🚨 Known Issues

Document any known test issues here:

1. **Issue**: [Description]
   - **Workaround**: [How to work around]
   - **Tracking**: [GitHub issue #]

---

## 📞 Support

**Questions about tests?**
- Review test comments in code
- Check Playwright docs: https://playwright.dev
- Open issue on GitHub

**Found a bug?**
1. Note which test failed
2. Capture screenshots/videos
3. Check browser console for errors
4. Create GitHub issue with details

---

## 🎯 Best Practices

1. **Run automated tests before every commit**
2. **Run full UAT before every deploy**
3. **Keep tests updated** when features change
4. **Document failures** with screenshots
5. **Fix failing tests immediately** - don't let them pile up
6. **Review test coverage** monthly
7. **Add tests for every bug fix** to prevent regression

---

**Last Updated**: December 13, 2025
**Test Suite Version**: 1.0
