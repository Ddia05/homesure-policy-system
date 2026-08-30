const express = require('express');
const router = express.Router();
const quoteController = require('../controllers/quoteController');
const { quoteValidator } = require('../validators/quoteValidator');
const { authenticateToken, authorizeRoles } = require('../middleware/authMiddleware');

// Only CUSTOMERs can generate and view their quotes currently
router.use(authenticateToken);
router.use(authorizeRoles('CUSTOMER'));

router.post('/', quoteValidator, quoteController.create);
router.get('/', quoteController.getAll);
router.get('/:id', quoteController.getOne);

module.exports = router;
