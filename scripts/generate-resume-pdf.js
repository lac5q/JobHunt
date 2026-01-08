const playwright = require('playwright');
const path = require('path');
const fs = require('fs');

async function generateResumePDF() {
    console.log('🚀 Starting PDF generation...\n');

    // Launch browser in headless mode
    const browser = await playwright.chromium.launch({
        headless: true
    });

    const context = await browser.newContext({
        viewport: { width: 1920, height: 1080 }
    });

    const page = await context.newPage();

    // Navigate to the printable resume
    const htmlPath = path.resolve(__dirname, '../printable-resume.html');
    const fileUrl = `file://${htmlPath}`;

    console.log(`📄 Loading: ${htmlPath}`);
    await page.goto(fileUrl, {
        waitUntil: 'networkidle',
        timeout: 30000
    });

    // Wait for fonts to load
    console.log('⏳ Waiting for fonts to load...');
    await page.waitForTimeout(2000);

    // Wait for specific font families to be ready
    await page.evaluate(() => {
        return Promise.all([
            document.fonts.load('400 11pt "PT Serif"'),
            document.fonts.load('700 11pt "PT Serif"'),
            document.fonts.load('400 1.5rem "Instrument Serif"'),
            document.fonts.load('400 3rem "Instrument Serif"')
        ]);
    });

    console.log('✅ Fonts loaded');

    // Take screenshot for verification (optional)
    const screenshotPath = path.resolve(__dirname, '../resume-preview.png');
    await page.screenshot({
        path: screenshotPath,
        fullPage: true
    });
    console.log(`📸 Screenshot saved: ${screenshotPath}`);

    // Generate PDF with optimal settings
    const pdfPath = path.resolve(__dirname, '../Luis-Calderon-Resume.pdf');

    console.log('📝 Generating PDF...');
    await page.pdf({
        path: pdfPath,
        format: 'Letter',
        printBackground: true,
        margin: {
            top: '0.5in',
            right: '0.5in',
            bottom: '0.5in',
            left: '0.5in'
        },
        preferCSSPageSize: false,
        displayHeaderFooter: false
    });

    console.log(`✅ PDF generated: ${pdfPath}`);

    // Get file size
    const stats = fs.statSync(pdfPath);
    const fileSizeKB = (stats.size / 1024).toFixed(2);
    console.log(`📊 File size: ${fileSizeKB} KB`);

    await browser.close();

    console.log('\n🎉 Resume PDF generation complete!');
    console.log('\nNext steps:');
    console.log('1. Open Luis-Calderon-Resume.pdf to verify visual quality');
    console.log('2. Check that fonts rendered correctly (PT Serif, Instrument Serif)');
    console.log('3. Verify all content is present and properly formatted');
    console.log('4. Compare file size to previous version (should be ~250 KB)');
}

generateResumePDF().catch(error => {
    console.error('❌ Error generating PDF:', error);
    process.exit(1);
});
