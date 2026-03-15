// routes/auth.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');

// Auth API routes
router.get('/health', userController.health);
router.post('/create-admin', userController.createAdmin);
router.post('/login', userController.login);
router.post('/logout', auth, userController.logout);
router.post('/check-session', auth, userController.isLoggedIn);

module.exports = router;