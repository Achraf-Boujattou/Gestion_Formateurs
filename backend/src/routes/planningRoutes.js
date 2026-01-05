const express = require('express');
const router = express.Router();
const planningController = require('../controllers/planningController');
const { verifyToken, isAdminOrAssistant } = require('../middleware/authMiddleware');

router.get('/', verifyToken, planningController.getAllPlannings);
router.post('/', verifyToken, isAdminOrAssistant, planningController.createPlanning);
router.delete('/:id', verifyToken, isAdminOrAssistant, planningController.deletePlanning);
router.get('/dependencies', verifyToken, planningController.getDependencies);

module.exports = router;
