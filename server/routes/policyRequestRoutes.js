const express = require('express');
const router = express.Router();
const policyRequestController = require('../controllers/policyRequestController');
const { policyRequestValidator } = require('../validators/policyRequestValidator');
const { authenticateToken, authorizeRoles } = require('../middleware/authMiddleware');

router.use(authenticateToken);
router.use(authorizeRoles('CUSTOMER'));

router.post('/', policyRequestValidator, policyRequestController.create);
router.get('/', policyRequestController.getAll);
router.get('/:id', policyRequestController.getOne);

module.exports = router;
