const express = require('express');
const { captureScreenshot } = require('./screenshot');

const app = express();
const port = process.env.PORT || 3000;

app.get('/screenshot', async (req, res) => {
    const url = req.query.url;  // Get the URL parameter
    if (!url) {
        return res.status(400).send('Missing "url" parameter');
    }
    try {
        const screenshot = await captureScreenshot(url);
        res.contentType('image/png');
        res.send(screenshot);  // Send the screenshot as a PNG
    } catch (error) {
        console.error(error);
        res.status(500).send('Error capturing screenshot');
    }
});

app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
});
