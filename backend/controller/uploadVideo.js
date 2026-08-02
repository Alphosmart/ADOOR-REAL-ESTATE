const fs = require('fs');
const path = require('path');
const multer = require('multer');
const { cloudinary, verifyCloudinaryConfig } = require('../config/cloudinary');

const uploadDirectory = path.join(__dirname, '../uploads/videos');
fs.mkdirSync(uploadDirectory, { recursive: true });

const storage = multer.diskStorage({
    destination: (req, file, callback) => callback(null, uploadDirectory),
    filename: (req, file, callback) => callback(null, `video-${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname).toLowerCase()}`)
});

const upload = multer({
    storage,
    limits: { fileSize: 100 * 1024 * 1024 },
    fileFilter: (req, file, callback) => callback(file.mimetype.startsWith('video/') ? null : new Error('Please select a valid video file.'), file.mimetype.startsWith('video/'))
}).single('video');

const uploadVideoController = (req, res) => {
    upload(req, res, async error => {
        if (error) return res.status(400).json({ success: false, error: true, message: error.message });
        if (!req.file) return res.status(400).json({ success: false, error: true, message: 'No video was uploaded.' });

        try {
            let videoUrl = `${req.protocol}://${req.get('host')}/uploads/videos/${req.file.filename}`;
            if (verifyCloudinaryConfig()) {
                const result = await cloudinary.uploader.upload(req.file.path, { resource_type: 'video', folder: 'adoo-property-videos' });
                videoUrl = result.secure_url;
                await fs.promises.unlink(req.file.path);
            }
            return res.json({ success: true, error: false, message: 'Video uploaded successfully.', data: { url: videoUrl } });
        } catch (uploadError) {
            return res.status(500).json({ success: false, error: true, message: uploadError.message || 'Video upload failed.' });
        }
    });
};

module.exports = uploadVideoController;
