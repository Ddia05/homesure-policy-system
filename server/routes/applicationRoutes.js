const express = require('express');
const router = express.Router();
const applicationController = require('../controllers/applicationController');
const { applicationValidator } = require('../validators/applicationValidator');
const { authenticateToken, authorizeRoles } = require('../middleware/authMiddleware');

router.use(authenticateToken);
router.use(authorizeRoles('CUSTOMER'));

router.post('/', applicationValidator, applicationController.create);
router.get('/', applicationController.getAll);
router.get('/:id', applicationController.getOne);

module.exports = router;
