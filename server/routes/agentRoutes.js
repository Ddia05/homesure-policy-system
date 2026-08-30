const express = require('express');
const router = express.Router();
const agentApplicationController = require('../controllers/agentApplicationController');
const agentPolicyController = require('../controllers/agentPolicyController');
const agentPolicyRequestController = require('../controllers/agentPolicyRequestController');
const { reviewValidator } = require('../validators/applicationValidator');
const { authenticateToken, authorizeRoles } = require('../middleware/authMiddleware');

router.use(authenticateToken);
router.use(authorizeRoles('AGENT'));

// Application Review Routes
router.get('/applications', agentApplicationController.getAll);
router.get('/applications/:id', agentApplicationController.getOne);
router.put('/applications/:id/approve', reviewValidator, agentApplicationController.approve);
router.put('/applications/:id/reject', reviewValidator, agentApplicationController.reject);

// Policy Management Routes
router.post('/applications/:id/issue-policy', agentPolicyController.issuePolicy);
router.get('/policies', agentPolicyController.getAll);
router.get('/policies/:id', agentPolicyController.getOne);

// Policy Request (Endorsement) Routes
router.get('/policy-requests', agentPolicyRequestController.getAll);
router.get('/policy-requests/:id', agentPolicyRequestController.getOne);
router.put('/policy-requests/:id/approve', agentPolicyRequestController.approve);
router.put('/policy-requests/:id/reject', agentPolicyRequestController.reject);

module.exports = router;
