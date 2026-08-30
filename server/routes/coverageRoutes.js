const express = require('express');
const router = express.Router();
const planController = require('../controllers/planController');
const { authenticateToken, authorizeRoles } = require('../middleware/authMiddleware');

// Both CUSTOMER and AGENT can read coverages
router.use(authenticateToken);
router.use(authorizeRoles('CUSTOMER', 'AGENT'));

// Coverage routes (mounted at /api/coverages)
router.get('/', planController.getAllCoverages);

module.exports = router;
