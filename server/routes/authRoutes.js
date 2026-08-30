const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { registerValidator, loginValidator } = require('../validators/authValidator');
const { authenticateToken } = require('../middleware/authMiddleware');

router.post('/register', registerValidator, authController.register);
router.post('/login', loginValidator, authController.login);
router.get('/me', authenticateToken, authController.getMe);

module.exports = router;
