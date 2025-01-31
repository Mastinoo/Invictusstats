const puppeteer = require('puppeteer-core');
const chromium = require('chromium'); // Import Chromium package
const express = require('express');
const app = express();

// Function to capture a screenshot using Puppeteer
async function captureScreenshot(url) {
    try {
        const browser = await puppeteer.launch({
            headless: true, // Set headless to true for production environments
            executablePath: chromium.path, // Manually set Chromium path
            args: ['--no-sandbox', '--disable-setuid-sandbox'] // Required for Puppeteer on Render
        });

        const page = await browser.newPage();

        await page.setUserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36");
        
        // Wait until the network is idle to ensure full page load
        await page.goto(url, { waitUntil: 'networkidle2' });

        console.log("Waiting for page elements...");

        // Wait for specific element (you may need to adjust based on your content)
        await page.waitForSelector('.webp');  // Adjust based on your widget

        // Capture the screenshot
        const screenshot = await page.screenshot();
        await browser.close();
        
        return screenshot;
    } catch (error) {
        console.error("Error during screenshot capture:", error);
        throw error;  // Re-throw error for handling in route
    }
}

module.exports = { captureScreenshot };

// Route to capture the screenshot and serve it as an image
app.get('/screenshot', async (req, res) => {
    const url = req.query.url;  // Get the URL passed as a query parameter

    if (!url) {
        return res.status(400).send('URL parameter is missing');
    }

    try {
        const screenshot = await captureScreenshot(url);

        // Log the first 50 bytes of the screenshot buffer
        console.log('First 50 bytes of the image data:', screenshot.slice(0, 50));

        res.contentType('image/png'); // Set the response type to PNG
        res.send(screenshot); // Send the screenshot as a response
    } catch (error) {
        console.error('Error capturing screenshot:', error);
        res.status(500).send('Error capturing screenshot: ' + error.message);
    }
});

// Start the server (Ensure Render listens on port 3000)
app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
