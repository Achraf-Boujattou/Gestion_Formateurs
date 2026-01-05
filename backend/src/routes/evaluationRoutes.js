const express = require('express');
const router = express.Router();
const evaluationController = require('../controllers/evaluationController');
const { verifyToken, isAdminOrAssistant } = require('../middleware/authMiddleware');

// Public routes for participants
router.get('/context/:formationId', evaluationController.getEvaluationContext);
router.post('/submit', evaluationController.submitEvaluation);

// Protected routes for admin/assistant
router.get('/', verifyToken, isAdminOrAssistant, evaluationController.getAllEvaluations);

module.exports = router;
