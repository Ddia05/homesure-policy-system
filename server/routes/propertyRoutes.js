const express = require('express');
const router = express.Router();
const propertyController = require('../controllers/propertyController');
const { propertyValidator } = require('../validators/propertyValidator');
const { authenticateToken, authorizeRoles } = require('../middleware/authMiddleware');

// All property routes currently require CUSTOMER role
router.use(authenticateToken);
router.use(authorizeRoles('CUSTOMER'));

router.post('/', propertyValidator, propertyController.create);
router.get('/', propertyController.getAll);
router.get('/:id', propertyController.getOne);
router.put('/:id', propertyValidator, propertyController.update);
router.delete('/:id', propertyController.remove);

module.exports = router;
