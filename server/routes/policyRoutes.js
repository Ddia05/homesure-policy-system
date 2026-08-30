const express = require('express');
const router = express.Router();
const policyController = require('../controllers/policyController');
const { authenticateToken, authorizeRoles } = require('../middleware/authMiddleware');

router.use(authenticateToken);
router.use(authorizeRoles('CUSTOMER'));

router.get('/', policyController.getAll);
router.get('/:id', policyController.getOne);

module.exports = router;
