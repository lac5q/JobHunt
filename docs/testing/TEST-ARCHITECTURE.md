# Test Architecture - AI Panel Integration

## Visual Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                    TESTING INFRASTRUCTURE                        │
└─────────────────────────────────────────────────────────────────┘
                                │
                ┌───────────────┴───────────────┐
                │                               │
         ┌──────▼──────┐                ┌──────▼──────┐
         │   Test      │                │   Test      │
         │   Suites    │                │  Utilities  │
         └──────┬──────┘                └──────┬──────┘
                │                               │
    ┌───────────┼───────────┐          ┌────────┼────────┐
    │           │           │          │        │        │
┌───▼───┐   ┌──▼───┐   ┌──▼──┐   ┌───▼───┐  ┌─▼──┐  ┌──▼───┐
│ test- │   │ regr-│   │test-│   │ run-  │  │run-│  │test- │
│ ai-   │   │ession│   │fixt-│   │ all-  │  │base│  │report│
│ panel │   │-test │   │ures │   │ tests │  │line│  │ .md  │
│ .js   │   │-suite│   │ .js │   │ .js   │  │.sh │  │      │
└───┬───┘   └──┬───┘   └──┬──┘   └───┬───┘  └─┬──┘  └──────┘
    │          │          │          │        │
    └──────────┴──────────┴──────────┴────────┘
                       │
                ┌──────▼──────┐
                │  Playwright  │
                │   Browser    │
                └──────┬───────┘
                       │
                ┌──────▼───────┐
                │  Dashboard   │
                │    HTML      │
                └──────────────┘
```

## Test Flow

```
START
  │
  ├─→ run-baseline-test.sh (Before Implementation)
  │     │
  │     └─→ test-ai-panel.js
  │           │
  │           ├─→ Load test-fixtures.js
  │           ├─→ Launch Playwright
  │           ├─→ Inject test data
  │           ├─→ Run 15 tests
  │           ├─→ Capture screenshots
  │           └─→ Report results
  │
  ├─→ test-ai-panel.js (During Implementation - After Each Milestone)
  │     │
  │     └─→ Quick feedback loop
  │
  └─→ run-all-tests.js (After Implementation - Final Validation)
        │
        ├─→ test-ai-panel.js (15 tests)
        ├─→ regression-test-suite.js (14 tests)
        ├─→ Aggregate results
        ├─→ Update test-report.md
        └─→ Generate screenshots
```

## File Dependencies

```
test-ai-panel.js
  │
  ├─→ requires: test-fixtures.js
  ├─→ requires: playwright
  ├─→ reads: job-search-dashboard.html
  ├─→ writes: /tmp/ai-panel-test.png
  └─→ outputs: console results

regression-test-suite.js
  │
  ├─→ requires: playwright
  ├─→ reads: job-search-dashboard.html
  └─→ writes: /tmp/regression-test.png

run-all-tests.js
  │
  ├─→ requires: test-ai-panel.js
  ├─→ requires: regression-test-suite.js
  ├─→ reads: test-report.md
  └─→ writes: test-report.md (updated)

run-baseline-test.sh
  │
  ├─→ executes: test-ai-panel.js
  └─→ writes: /tmp/test-baseline/ai-panel-baseline.log
```

## Test Coverage Map

```
┌─────────────────────────────────────────────────────┐
│              AI PANEL FEATURE TREE                   │
└─────────────────────────────────────────────────────┘
                        │
        ┌───────────────┴───────────────┐
        │                               │
    ┌───▼────┐                     ┌────▼────┐
    │   UI   │                     │  Logic  │
    └───┬────┘                     └────┬────┘
        │                               │
  ┌─────┼─────┐                   ┌─────┼─────┐
  │     │     │                   │     │     │
┌─▼─┐ ┌─▼─┐ ┌─▼─┐              ┌─▼─┐ ┌─▼─┐ ┌─▼─┐
│DOM│ │Anim│ │Btn│              │Ctx│ │Gen│ │Log│
│T1 │ │T4 │ │T2 │              │T5 │ │T8 │ │T11│
│T8 │ │T12│ │T9 │              │   │ │   │ │   │
└───┘ └───┘ └───┘              └───┘ └───┘ └───┘

DOM   = Panel exists in DOM
Anim  = Open/close animations
Btn   = Compose, Generate, Copy, Send buttons
Ctx   = Contact context loading
Gen   = AI message generation
Log   = Message history logging
```

## Test Execution Timeline

```
Phase 0: BEFORE IMPLEMENTATION
├─ Day 0: Run baseline tests
│  └─ Expected: All FAIL/SKIP ✅
│
Phase 1: DURING IMPLEMENTATION
├─ Milestone 1: Panel HTML added
│  ├─ Run: test-ai-panel.js
│  └─ Expected: TEST 1, 2, 8 PASS ✅
│
├─ Milestone 2: openAIPanel function
│  ├─ Run: test-ai-panel.js
│  └─ Expected: TEST 3, 10 PASS ✅
│
├─ Milestone 3: Contact context
│  ├─ Run: test-ai-panel.js
│  └─ Expected: TEST 5 PASS ✅
│
├─ Milestone 4: Message selectors
│  ├─ Run: test-ai-panel.js
│  └─ Expected: TEST 7, 12 PASS ✅
│
├─ Milestone 5: Generate button
│  ├─ Run: test-ai-panel.js
│  └─ Expected: TEST 8 PASS ✅
│
├─ Milestone 6: Copy/Send
│  ├─ Run: test-ai-panel.js
│  └─ Expected: TEST 9, 10 PASS ✅
│
└─ Milestone 7: Close/Reopen
   ├─ Run: test-ai-panel.js
   └─ Expected: TEST 12, 13 PASS ✅
│
Phase 2: AFTER IMPLEMENTATION
└─ Day N: Final validation
   ├─ Run: run-all-tests.js
   ├─ Review: test-report.md
   └─ Expected: All PASS ✅
```

## Performance Monitoring

```
┌────────────────────────────────────────────┐
│         PERFORMANCE THRESHOLDS             │
└────────────────────────────────────────────┘

Panel Open Animation       ████████░░ 300ms ✅
Panel Close Animation      ████████░░ 300ms ✅
Gmail Search (Single)      ███████████████ 1500ms ✅
Gmail Search (Dual)        ████████████████████ 2000ms ✅
AI Generation (Claude)     ████████████████████████████████ 5000ms ✅
AI Generation (OpenAI)     ████████████████████ 3000ms ✅
Message Logging            ████░ 500ms ✅

Legend:
  ████ = Expected duration
  ✅ = Within threshold
  ⚠️  = Exceeds threshold
  ⏭️  = Not tested
```

## Test Data Flow

```
┌───────────────┐
│ test-fixtures │
│     .js       │
└───────┬───────┘
        │
        ├─→ testContact ──────────────┐
        │                             │
        ├─→ mockGmailHistory ─────────┤
        │                             │
        ├─→ mockAIResponses ──────────┤
        │                             ▼
        ├─→ selectors ────────┐   ┌────────────┐
        │                     └──→│ test-ai-   │
        └─→ performanceThresholds  │ panel.js   │
                                   └────┬───────┘
                                        │
                                        ├─→ Inject into localStorage
                                        │
                                        ├─→ Verify against selectors
                                        │
                                        └─→ Benchmark vs thresholds
```

## Integration Points

```
┌────────────────────────────────────────────────────┐
│              TESTING ECOSYSTEM                      │
└────────────────────────────────────────────────────┘
        │
        ├─→ PRODUCT-SPEC.md (Requirements)
        │     └─→ Section 8: Testing Checklist
        │
        ├─→ job-search-dashboard.html (Implementation)
        │     └─→ AI Panel HTML/CSS/JS
        │
        ├─→ TESTING.md (Documentation)
        │     └─→ How to run tests
        │
        ├─→ test-report.md (Results)
        │     └─→ Pass/fail status
        │
        └─→ CI/CD Pipeline (Future)
              └─→ Automated test runs on commit
```

## Communication Flow

```
┌──────────────────┐
│ Implementation   │
│     Agent        │
└────────┬─────────┘
         │
         │ 1. Implements feature
         ▼
┌──────────────────┐
│ test-ai-panel.js │
└────────┬─────────┘
         │
         │ 2. Runs tests
         ▼
┌──────────────────┐
│  Test Results    │
│   (Console)      │
└────────┬─────────┘
         │
         │ 3. Reports status
         ▼
┌──────────────────┐
│ Implementation   │
│     Agent        │
└────────┬─────────┘
         │
         │ 4. Fixes failures
         │
         └─────┐
               │
         ┌─────▼─────┐
         │  Iterate  │
         │  (Loop)   │
         └───────────┘
```

## Success Criteria Tree

```
ALL TESTS PASS
    │
    ├─→ UI/UX Tests (6)
    │     ├─→ Panel exists ✓
    │     ├─→ Buttons visible ✓
    │     ├─→ Animations smooth ✓
    │     └─→ Shortcuts work ✓
    │
    ├─→ Functional Tests (5)
    │     ├─→ Functions defined ✓
    │     ├─→ Context loads ✓
    │     ├─→ Selectors work ✓
    │     └─→ Sequential OK ✓
    │
    ├─→ Integration Tests (4)
    │     ├─→ Gmail search ✓
    │     ├─→ AI generation ✓
    │     ├─→ Copy works ✓
    │     └─→ Send works ✓
    │
    └─→ Performance Tests (7)
          ├─→ All < thresholds ✓
          └─→ No regressions ✓
```

## Tools & Technologies

```
┌─────────────────────────────────────────────┐
│             TESTING STACK                    │
└─────────────────────────────────────────────┘

Language:        JavaScript (Node.js)
Framework:       Playwright 1.57.0
Browser:         Chromium (headless: false)
Test Runner:     Custom (test-ai-panel.js)
Assertions:      Custom (pass/fail arrays)
Screenshots:     Playwright built-in
Performance:     Date.now() timing
Mocks:           test-fixtures.js
Reports:         Markdown (test-report.md)
CI/CD:           Future (GitHub Actions)
```

## Quick Reference

**Run baseline tests:**
```bash
./run-baseline-test.sh
```

**Run AI panel tests:**
```bash
node test-ai-panel.js
```

**Run all tests + report:**
```bash
node run-all-tests.js
```

**View report:**
```bash
cat test-report.md
```

**View screenshots:**
```bash
open /tmp/ai-panel-test.png
```

---

**Architecture Status:** COMPLETE
**Created:** 2024-12-12
**Total Test Coverage:** 27/27 Phase 1 requirements
