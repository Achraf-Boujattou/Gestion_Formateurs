const express = require('express');
const router = express.Router();
const entrepriseController = require('../controllers/entrepriseController');
const { verifyToken, isAdminOrAssistant } = require('../middleware/authMiddleware');

// All routes are protected and restricted to admin or assistant
router.get('/', verifyToken, isAdminOrAssistant, entrepriseController.getAllEntreprises);
router.post('/', verifyToken, isAdminOrAssistant, entrepriseController.createEntreprise);
router.put('/:id', verifyToken, isAdminOrAssistant, entrepriseController.updateEntreprise);
router.delete('/:id', verifyToken, isAdminOrAssistant, entrepriseController.deleteEntreprise);

module.exports = router;
