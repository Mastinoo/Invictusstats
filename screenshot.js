const puppeteer = require('puppeteer-core');
const chromium = require('chromium'); // Import Chromium package
const express = require('express');
const app = express();

// Function to capture a screenshot using Puppeteer
async function captureScreenshot(url) {
    const browser = await puppeteer.launch({
        headless: "new",
        executablePath: chromium.path, // Manually set Chromium path
        args: ['--no-sandbox', '--disable-setuid-sandbox'] // Required for Puppeteer on Render
    });
    const page = await browser.newPage();
    
    await page.setUserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36");
    // Wait until the network is idle, making sure the page is fully loaded
    await page.goto(url, {waitUntil: 'networkidle0', timeout: 60000});

    console.log("Waiting for page elements...");
        await page.waitForTimeout(5000);
    // Wait for the widget selector (you may need to adjust this based on your content)
    await page.waitForSelector('.webp', { timeout: 60000 });

    // Capture the screenshot after waiting for the page to load fully
    const screenshot = await page.screenshot();
    await browser.close();
    return screenshot;
}

module.exports = { captureScreenshot };  // Ensure correct export

// Route to capture the screenshot and serve it as an image
app.get('/screenshot', async (req, res) => {
    const url = req.query.url;  // Get the URL passed as a query parameter

    if (!url) {
        return res.status(400).send('URL parameter is missing');
    }

    try {
        const screenshot = await captureScreenshot(url);
        res.contentType('image/png'); // Set the response type as PNG
        res.send(screenshot); // Send the screenshot as a response
    } catch (error) {
        console.error('Error capturing screenshot:', error);
        res.status(500).send('Error capturing screenshot');
    }
});

// Start your server (Make sure Render listens on port 3000)
app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});