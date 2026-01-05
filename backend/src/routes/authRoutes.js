const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const rateLimiter = require('../middleware/rateLimiter');

// Apply rate limiting to authentication routes (5 attempts per 15 minutes)
router.post('/login', rateLimiter(5, 15 * 60 * 1000), authController.login);
router.post('/register', rateLimiter(3, 60 * 60 * 1000), authController.register);
router.post('/forgot-password', rateLimiter(3, 60 * 60 * 1000), authController.forgotPassword);

module.exports = router;
