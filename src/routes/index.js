const express = require('express');
const router = express.Router();
const videos = require('../metadata');
const fs = require("fs");

router.get('/', (req, res) => {
    res.json(videos)
});

router.get('/:id/metadata', (req, res) => {
    const vid = videos.find(v => v.id === req.params.id);
    res.json(vid);
});

router.get('/video/:id', (req, res) => {
    const videoPath = `assets/${req.params.id}.mp4`;
    const videoStat = fs.statSync(videoPath);
    const fileSize = videoStat.size;
    const videoRange = req.headers.range;

    console.log({
        videoRange
    });

    if (videoRange) {
        const parts = videoRange.replace(/bytes=/, "").split("-");
        const start = parseInt(parts[0], 10);
        const end = parts[1]
            ? parseInt(parts[1], 10)
            : fileSize - 1;

        const chunksize = (end - start) + 1;
        const header = {
            'Content-Range': `bytes ${start}-${end}/${fileSize}`,
            'Accept-Ranges': 'bytes',
            'Content-Length': chunksize,
            'Content-Type': 'video/mp4',
        };

        res.writeHead(206, header);
        fs.createReadStream(videoPath, { start, end }).pipe(res);
    } else {
        const header = {
            'Content-Length': fileSize,
            'Content-Type': 'video/mp4',
        };

        res.writeHead(200, header);
        fs.createReadStream(videoPath).pipe(res);
    }
});


module.exports = router;