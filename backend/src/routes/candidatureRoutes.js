const express = require('express');
const router = express.Router();
const candidatureController = require('../controllers/candidatureController');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');

// Public route for formateurs to apply
router.post('/public', candidatureController.submitCandidature);

// Admin routes to manage applications
router.get('/', verifyToken, isAdmin, candidatureController.getAllCandidatures);
router.put('/:id/status', verifyToken, isAdmin, candidatureController.updateStatus);

module.exports = router;
