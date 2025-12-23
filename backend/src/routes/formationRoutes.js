const express = require('express');
const router = express.Router();
const formationController = require('../controllers/formationController');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');

// Public route to view formations
router.get('/', formationController.getAllFormations);

// Protected route to add formation (Admin only)
router.post('/', verifyToken, isAdmin, formationController.addFormation);

// Update formation
router.put('/:id', verifyToken, isAdmin, formationController.updateFormation);

// Delete formation
router.delete('/:id', verifyToken, isAdmin, formationController.deleteFormation);

module.exports = router;
