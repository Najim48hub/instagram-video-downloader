const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('../public'));

app.post('/download', async (req, res) => {
    const { url } = req.body;

    if (!url || !url.includes('instagram.com')) {
        return res.status(400).json({ error: 'Invalid Instagram URL' });
    }

    try {
        const apiResponse = await axios.get('https://api.example.com/instagram', {
            params: { url },
            headers: { 'Authorization': '010ecb5d36mshafaf75fd79fd878p17745cjsn35e8c2ac5f26' }
        });

        const videoData = {
            downloadUrl: apiResponse.data.video_url,
            thumbnail: apiResponse.data.thumbnail_url,
            title: apiResponse.data.caption || 'Instagram Video'
        };

        res.json(videoData);
    } catch (error) {
        console.error(error);
        if (error.response?.status === 403) {
            res.status(403).json({ error: 'Private account or invalid URL' });
        } else {
            res.status(500).json({ error: 'Failed to fetch video data' });
        }
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
