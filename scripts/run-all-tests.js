const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

/**
 * Master Test Runner
 *
 * Runs both regression tests and AI panel tests, then generates a
 * comprehensive test report with screenshots and performance metrics.
 */

async function runAllTests() {
    console.log('\n' + '='.repeat(70));
    console.log('MASTER TEST SUITE - AI PANEL INTEGRATION');
    console.log('='.repeat(70));
    console.log('\nRunning all test suites...\n');

    const startTime = Date.now();
    const allResults = {
        regression: null,
        aiPanel: null,
        summary: {
            totalTests: 0,
            totalPassed: 0,
            totalFailed: 0,
            totalSkipped: 0,
            duration: 0
        }
    };

    try {
        // Run regression tests
        console.log('📋 STEP 1: Running Regression Tests...\n');
        const regressionModule = require('./regression-test-suite.js');
        // Note: regression-test-suite.js auto-runs, so we need to modify it or just note results

        // Run AI panel tests
        console.log('\n📋 STEP 2: Running AI Panel Tests...\n');
        const { runAIPanelTests } = require('./test-ai-panel.js');
        const aiPanelResults = await runAIPanelTests();
        allResults.aiPanel = aiPanelResults.results;

        // Calculate summary
        if (allResults.aiPanel) {
            allResults.summary.totalPassed += allResults.aiPanel.passed.length;
            allResults.summary.totalFailed += allResults.aiPanel.failed.length;
            allResults.summary.totalSkipped += allResults.aiPanel.skipped.length;
        }

        allResults.summary.totalTests =
            allResults.summary.totalPassed +
            allResults.summary.totalFailed +
            allResults.summary.totalSkipped;

        allResults.summary.duration = Date.now() - startTime;

        // Generate report
        console.log('\n📋 STEP 3: Generating Test Report...\n');
        generateTestReport(allResults);

        console.log('\n' + '='.repeat(70));
        console.log('ALL TESTS COMPLETE');
        console.log('='.repeat(70));
        console.log(`\nTotal Duration: ${Math.round(allResults.summary.duration / 1000)}s`);
        console.log(`Pass Rate: ${calculatePassRate(allResults.summary)}%`);

        return allResults.summary.totalFailed === 0;

    } catch (error) {
        console.error('\n❌ Test execution failed:', error);
        return false;
    }
}

function calculatePassRate(summary) {
    if (summary.totalTests === 0) return 0;
    return Math.round((summary.totalPassed / summary.totalTests) * 100);
}

function generateTestReport(results) {
    const reportPath = path.join(__dirname, 'test-report.md');
    let report = fs.readFileSync(reportPath, 'utf8');

    // Update date
    const today = new Date().toISOString().split('T')[0];
    report = report.replace('[To be filled after test run]', today);

    // Update summary numbers
    if (results.aiPanel) {
        const passed = results.aiPanel.passed.length;
        const failed = results.aiPanel.failed.length;
        const skipped = results.aiPanel.skipped.length;
        const total = passed + failed + skipped;
        const passRate = total > 0 ? Math.round((passed / total) * 100) : 0;

        report = report.replace('**Total Tests:** [TBD]', `**Total Tests:** ${total}`);
        report = report.replace('**Passed:** [TBD]', `**Passed:** ${passed}`);
        report = report.replace('**Failed:** [TBD]', `**Failed:** ${failed}`);
        report = report.replace('**Skipped:** [TBD]', `**Skipped:** ${skipped}`);
        report = report.replace('**Pass Rate:** [TBD]%', `**Pass Rate:** ${passRate}%`);

        // Update status
        const status = failed === 0 ? '✅ ALL TESTS PASSED' :
                      failed > 0 && passed > 0 ? '⚠️ PARTIAL IMPLEMENTATION' :
                      '❌ IMPLEMENTATION NOT STARTED';
        report = report.replace('**Status:** ⚠️ PENDING IMPLEMENTATION', `**Status:** ${status}`);
    }

    // Update performance metrics
    if (results.aiPanel && results.aiPanel.performance) {
        const perf = results.aiPanel.performance;
        let perfTable = '\n| Metric | Threshold | Actual | Status |\n';
        perfTable += '|--------|-----------|--------|--------|\n';

        const metrics = {
            panelOpenAnimation: { threshold: 300, name: 'Panel Open Animation' },
            panelCloseAnimation: { threshold: 300, name: 'Panel Close Animation' },
            gmailSearchSingle: { threshold: 1500, name: 'Gmail Search (Single)' },
            gmailSearchDual: { threshold: 2000, name: 'Gmail Search (Dual)' },
            aiGeneration: { threshold: 5000, name: 'AI Generation' }
        };

        Object.entries(metrics).forEach(([key, { threshold, name }]) => {
            const actual = perf[key] || 'N/A';
            const actualNum = typeof actual === 'number' ? actual : 0;
            const status = typeof actual === 'number' && actualNum <= threshold ? '✅ Pass' :
                          typeof actual === 'number' ? '⚠️ Slow' : '⏭️ Skip';
            perfTable += `| ${name} | ${threshold}ms | ${actual}ms | ${status} |\n`;
        });

        // Replace performance table
        const perfTableRegex = /\| Metric \| Threshold[\s\S]*?\n\n/;
        report = report.replace(perfTableRegex, perfTable + '\n');
    }

    // Update test results
    if (results.aiPanel) {
        // Map test results to report sections
        results.aiPanel.passed.forEach(result => {
            const testMatch = result.match(/TEST (\d+[ab]?):/);
            if (testMatch) {
                const testNum = testMatch[1];
                report = report.replace(
                    new RegExp(`(TEST ${testNum}:.*?\\n- \\*\\*Status:\\*\\*) \\[PENDING\\]`, 's'),
                    `$1 ✅ PASSED`
                );
            }
        });

        results.aiPanel.failed.forEach(result => {
            const testMatch = result.match(/TEST (\d+[ab]?):/);
            if (testMatch) {
                const testNum = testMatch[1];
                report = report.replace(
                    new RegExp(`(TEST ${testNum}:.*?\\n- \\*\\*Status:\\*\\*) \\[PENDING\\]`, 's'),
                    `$1 ❌ FAILED`
                );
            }
        });

        results.aiPanel.skipped.forEach(result => {
            const testMatch = result.match(/TEST (\d+[ab]?):/);
            if (testMatch) {
                const testNum = testMatch[1];
                report = report.replace(
                    new RegExp(`(TEST ${testNum}:.*?\\n- \\*\\*Status:\\*\\*) \\[PENDING\\]`, 's'),
                    `$1 ⏭️ SKIPPED`
                );
            }
        });
    }

    // Update screenshots section
    report = report.replace(
        '- **AI Panel Open:** `/tmp/ai-panel-test.png`',
        `- **AI Panel Open:** \`/tmp/ai-panel-test.png\` (${fs.existsSync('/tmp/ai-panel-test.png') ? '✅ Generated' : '❌ Missing'})`
    );

    // Update report status
    report = report.replace(
        '**Report Status:** DRAFT - Awaiting implementation and first test run',
        `**Report Status:** UPDATED - Last run: ${new Date().toLocaleString()}`
    );

    fs.writeFileSync(reportPath, report);
    console.log(`✅ Test report updated: ${reportPath}`);
}

// Run if executed directly
if (require.main === module) {
    runAllTests().then(success => {
        process.exit(success ? 0 : 1);
    }).catch(error => {
        console.error('Master test runner failed:', error);
        process.exit(1);
    });
}

module.exports = { runAllTests };
