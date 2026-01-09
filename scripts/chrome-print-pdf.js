const playwright = require('playwright');
const path = require('path');
const fs = require('fs');

async function chromePrintToPDF() {
    console.log('🚀 Starting Chrome native print to PDF...\n');

    const browser = await playwright.chromium.launch({
        headless: true
    });

    const context = await browser.newContext();
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
    await page.waitForTimeout(3000);

    await page.evaluate(() => {
        return Promise.all([
            document.fonts.load('400 11pt "PT Serif"'),
            document.fonts.load('700 11pt "PT Serif"'),
            document.fonts.load('400 1.5rem "Instrument Serif"'),
            document.fonts.load('400 3rem "Instrument Serif"')
        ]);
    });

    console.log('✅ Fonts loaded');

    // Use Chrome DevTools Protocol to print
    console.log('📝 Printing with Chrome DevTools Protocol...');

    const client = await context.newCDPSession(page);

    const pdfData = await client.send('Page.printToPDF', {
        printBackground: true,
        paperWidth: 8.5,  // inches
        paperHeight: 11,  // inches
        marginTop: 0.5,   // inches
        marginBottom: 0.5,
        marginLeft: 0.5,
        marginRight: 0.5,
        preferCSSPageSize: false
    });

    const pdfPath = path.resolve(__dirname, '../Luis-Calderon-Resume.pdf');
    fs.writeFileSync(pdfPath, Buffer.from(pdfData.data, 'base64'));

    console.log(`✅ PDF generated: ${pdfPath}`);

    const stats = fs.statSync(pdfPath);
    const fileSizeKB = (stats.size / 1024).toFixed(2);
    console.log(`📊 File size: ${fileSizeKB} KB`);

    await browser.close();
    console.log('\n🎉 Resume PDF generation complete!');
}

chromePrintToPDF().catch(error => {
    console.error('❌ Error:', error);
    process.exit(1);
});
