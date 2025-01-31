const puppeteer = require('puppeteer');

async function captureScreenshot(url) {
    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'] // Required for Puppeteer on Render
    });
    const page = await browser.newPage();
    await page.goto(url);
    const screenshot = await page.screenshot(); // Capture screenshot
    await browser.close();
    return screenshot;
}

module.exports = { captureScreenshot };
