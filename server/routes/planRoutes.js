const express = require('express');
const router = express.Router();
const planController = require('../controllers/planController');
const { authenticateToken, authorizeRoles } = require('../middleware/authMiddleware');

// Both CUSTOMER and AGENT can read plans and coverages
router.use(authenticateToken);
router.use(authorizeRoles('CUSTOMER', 'AGENT'));

// Plan routes (mounted at /api/plans)
router.get('/', planController.getAllPlans);
router.get('/:id', planController.getPlanById);

module.exports = router;
