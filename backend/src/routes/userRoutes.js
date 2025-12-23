const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');

// Using /utilisateurs as base path from app.js
// Protect this route: only logged in Admins can see all users
router.get('/', verifyToken, isAdmin, userController.getAllUsers);

module.exports = router;
