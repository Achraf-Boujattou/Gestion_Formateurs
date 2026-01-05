const express = require('express');
const router = express.Router();
const groupeController = require('../controllers/groupeController');
const { verifyToken, isAdminOrAssistant } = require('../middleware/authMiddleware');

router.get('/', verifyToken, isAdminOrAssistant, groupeController.getAllGroups);
router.post('/', verifyToken, isAdminOrAssistant, groupeController.createGroup);
router.post('/membres', verifyToken, isAdminOrAssistant, groupeController.addIndividualToGroup);
router.get('/:id/membres', verifyToken, isAdminOrAssistant, groupeController.getGroupMembers);
router.delete('/:id', verifyToken, isAdminOrAssistant, groupeController.deleteGroup);

module.exports = router;
