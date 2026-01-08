const { chromium } = require('playwright');
const path = require('path');

async function generateArchitectureScreenshot() {
  console.log('Starting architecture diagram screenshot generation...');

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  // Set a large viewport for high resolution
  await page.setViewportSize({ width: 2400, height: 1600 });

  const diagramPath = path.join(__dirname, 'architecture-diagram.html');
  const fileUrl = `file://${diagramPath}`;

  // Listen for console logs and errors from the page
  page.on('console', msg => console.log(`PAGE LOG: ${msg.text()}`));
  page.on('pageerror', err => console.log(`PAGE ERROR: ${err.message}`));

  console.log(`Loading: ${fileUrl}`);
  await page.goto(fileUrl);

  // Wait for Mermaid to render
  // We can wait for the SVG element to appear
  try {
    await page.waitForSelector('.mermaid svg', { timeout: 10000 });
    // Give it a little extra time to settle animations or layout
    await page.waitForTimeout(2000); 
  } catch (e) {
    console.error('Timeout waiting for Mermaid diagram to render. It might not have loaded correctly.');
    // Proceed anyway, maybe we catch an error state or partial render
  }

  const screenshotPath = path.join(__dirname, 'architecture-diagram.png');
  await page.screenshot({ path: screenshotPath, fullPage: true });

  console.log(`✓ Captured: Architecture Diagram -> ${screenshotPath}`);

  await browser.close();
}

generateArchitectureScreenshot().catch((error) => {
  console.error('Error generating screenshot:', error);
  process.exit(1);
});
