const express = require('express');
const router = express.Router();
const uploadMiddleware = require('../middlewares/upload.middleware');
const uploadController = require('../controllers/upload.controller');

// POST /api/upload - Accepts up to 10 handwritten pages (images/PDF)
router.post('/', uploadMiddleware.array('files', 10), uploadController.handleUpload);

module.exports = router;
