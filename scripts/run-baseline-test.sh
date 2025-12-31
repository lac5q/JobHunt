#!/bin/bash

# Baseline Test Runner
# Runs tests BEFORE implementation to establish that all AI panel tests fail
# This proves the tests are working correctly (they should fail before code exists)

echo "================================="
echo "BASELINE TEST RUN"
echo "================================="
echo ""
echo "This run establishes that AI panel tests FAIL before implementation."
echo "Expected results:"
echo "  - All AI panel tests: FAIL or SKIP"
echo "  - Regression tests: PASS (existing features)"
echo ""
echo "Press Enter to continue..."
read

# Change to script directory
cd "$(dirname "$0")"

# Verify Playwright is installed
if ! npm list playwright > /dev/null 2>&1; then
    echo "❌ Error: Playwright not installed"
    echo "Run: npm install playwright"
    exit 1
fi

echo "✅ Playwright installed"
echo ""

# Create baseline results directory
mkdir -p /tmp/test-baseline

# Run AI panel tests
echo "================================="
echo "Running AI Panel Tests (Baseline)"
echo "================================="
echo ""
node test-ai-panel.js 2>&1 | tee /tmp/test-baseline/ai-panel-baseline.log

# Capture exit code
AI_EXIT_CODE=$?

echo ""
echo "================================="
echo "Baseline Test Complete"
echo "================================="
echo ""

if [ $AI_EXIT_CODE -ne 0 ]; then
    echo "✅ BASELINE VERIFIED: AI panel tests failed as expected"
    echo ""
    echo "This is CORRECT - tests should fail before implementation."
    echo ""
    echo "Next steps:"
    echo "  1. Implementation Agent: Start Phase 1 implementation"
    echo "  2. Run: node test-ai-panel.js (after each milestone)"
    echo "  3. Goal: All tests passing by end of Phase 1"
    echo ""
    echo "Test log: /tmp/test-baseline/ai-panel-baseline.log"
    echo "Screenshot: /tmp/ai-panel-test.png"
else
    echo "⚠️  WARNING: AI panel tests passed before implementation!"
    echo ""
    echo "This is unexpected. Possible reasons:"
    echo "  - Implementation already exists"
    echo "  - Tests are too lenient"
    echo "  - Test fixtures need adjustment"
    echo ""
    echo "Review the test log to investigate."
fi

echo ""
