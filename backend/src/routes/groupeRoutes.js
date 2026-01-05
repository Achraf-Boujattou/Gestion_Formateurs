const express = require('express');
const router = express.Router();
const groupeController = require('../controllers/groupeController');
const { verifyToken, isAdminOrAssistant, isFormateur } = require('../middleware/authMiddleware');

router.get('/', verifyToken, isAdminOrAssistant, groupeController.getAllGroups);
router.post('/', verifyToken, isAdminOrAssistant, groupeController.createGroup);
router.post('/membres', verifyToken, isAdminOrAssistant, groupeController.addIndividualToGroup);
router.get('/:id/membres', verifyToken, isAdminOrAssistant, groupeController.getGroupMembers);
router.delete('/:id', verifyToken, isAdminOrAssistant, groupeController.deleteGroup);

// Formateur Specific Routes
router.get('/my-groups', verifyToken, isFormateur, groupeController.getTrainerGroups);
router.get('/my-students', verifyToken, isFormateur, groupeController.getTrainerStudents);

module.exports = router;
