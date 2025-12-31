const { chromium } = require('playwright');

async function testPlaywright() {
  console.log('Testing Playwright setup...\n');

  try {
    const browser = await chromium.launch({ headless: true });
    console.log('✓ Chromium browser launched successfully');

    const page = await browser.newPage();
    console.log('✓ New page created');

    await page.setViewportSize({ width: 1920, height: 1080 });
    console.log('✓ Viewport set to 1920x1080');

    await page.goto('https://www.example.com');
    console.log('✓ Navigated to example.com');

    const title = await page.title();
    console.log(`✓ Page title: "${title}"`);

    await browser.close();
    console.log('✓ Browser closed successfully');

    console.log('\n🎉 Playwright is working correctly!');
    console.log('You can now run: npm run screenshots');
  } catch (error) {
    console.error('❌ Error testing Playwright:', error.message);
    process.exit(1);
  }
}

testPlaywright();
