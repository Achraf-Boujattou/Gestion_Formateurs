const express = require('express');
const router = express.Router();
const inscriptionController = require('../controllers/inscriptionController');
const { verifyToken, isAdminOrAssistant } = require('../middleware/authMiddleware');

// Public route
router.post('/public', inscriptionController.publicRegister);

// Admin routes
router.get('/', verifyToken, isAdminOrAssistant, inscriptionController.getAllInscriptions);
router.put('/:id/status', verifyToken, isAdminOrAssistant, inscriptionController.updateStatus);

module.exports = router;
