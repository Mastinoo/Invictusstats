const puppeteer = require('puppeteer-core');
const chromium = require('chromium');
const express = require('express');
const app = express();

// Function to capture a screenshot using Puppeteer
async function captureScreenshot(url) {
    try {
        const browser = await puppeteer.launch({
            headless: true,
            executablePath: chromium.path,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });

        const page = await browser.newPage();
        
        await page.setUserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36");

        // Wait until the network is idle or page is fully loaded
        await page.goto(url, { waitUntil: 'load' });

        // Log the page content for debugging purposes (first 500 characters)
        const pageContent = await page.content();
        console.log('Page content (first 500 chars):', pageContent.slice(0, 500));

        // Wait for a more general element to ensure the page has loaded fully
        await page.waitForSelector('body');  // Can change this based on your needs

        // Capture the screenshot
        const screenshot = await page.screenshot();
        await browser.close();
        
        return screenshot;
    } catch (error) {
        console.error("Error during screenshot capture:", error);
        throw error;
    }
}

module.exports = { captureScreenshot };

// Route to capture the screenshot and serve it as an image
app.get('/screenshot', async (req, res) => {
    const url = req.query.url;

    if (!url) {
        return res.status(400).send('URL parameter is missing');
    }

    try {
        const screenshot = await captureScreenshot(url);

        // Log the first 50 bytes of the screenshot buffer
        console.log('First 50 bytes of the image data:', screenshot.slice(0, 50));

        res.contentType('image/png');
        res.send(screenshot);
    } catch (error) {
        console.error('Error capturing screenshot:', error);
        res.status(500).send('Error capturing screenshot: ' + error.message);
    }
});

// Start the server
app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
