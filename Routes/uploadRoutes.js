// Routes/uploadRoutes.js
const express = require('express');
const router = express.Router();
const upload = require('../middleware/multer'); // ✅ Do NOT use { upload }

router.post('/image', upload.single('avatar'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }

    res.status(200).json({
        message: 'File uploaded successfully',
        filePath: `/image/${req.file.filename}`
    });
});

module.exports = router;
