const express = require('express');
const router = express.Router();
const healthController = require('../controllers/health.controller');

// GET /api/health - Diagnostic & operational status check
router.get('/', healthController.getHealth);

module.exports = router;
