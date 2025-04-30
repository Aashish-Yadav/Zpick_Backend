const express = require('express');
const router = express.Router();
const upload = require('../middleware/multer');
const { uploadOnCloudinary } = require('../Utils/Cloudinary');
const User = require('../model/Users.js');
const fs = require('fs');

// Add auth middleware to protect this route
router.post('/image',  upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        // Get userId from token or from form data
        const userId = req.user?.id || req.body.userId;
        
        if (!userId) {
            return res.status(400).json({ error: 'User ID is required' });
        }

        console.log('Processing upload for user:', userId);
        console.log('File path:', req.file.path);

        const result = await uploadOnCloudinary(req.file.path);
        
        if (!result || !result.url || !result.public_id) {
            return res.status(500).json({ error: 'Cloudinary upload failed' });
        }

        // Clean up the temporary file
        try {
            fs.unlinkSync(req.file.path);
        } catch (err) {
            console.warn('Failed to delete temp file:', err);
        }

        // Update user profile with new image
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            {
                profileImage: result.url,
                profileImagePublicId: result.public_id
            },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ error: 'User not found' });
        }

        return res.status(200).json({
            message: 'Image uploaded and user updated',
            imageUrl: result.url,
            user: updatedUser
        });
    } catch (error) {
        console.error("Upload error:", error);
        return res.status(500).json({ 
            error: 'Server error', 
            details: error.message 
        });
    }
});


module.exports = router;