const { body } = require('express-validator');

const PROPERTY_TYPES = ['APARTMENT', 'INDEPENDENT_HOUSE', 'VILLA', 'TOWNHOUSE'];
const CONSTRUCTION_TYPES = ['CONCRETE', 'BRICK', 'WOOD', 'MIXED'];

const propertyValidator = [
  body('address').notEmpty().withMessage('Address is required'),
  body('property_type')
    .isIn(PROPERTY_TYPES)
    .withMessage(`Property type must be one of: ${PROPERTY_TYPES.join(', ')}`),
  body('property_value')
    .isFloat({ gt: 0 })
    .withMessage('Property value must be a positive number'),
  body('construction_year')
    .isInt({ min: 1800, max: new Date().getFullYear() })
    .withMessage(`Construction year must be between 1800 and ${new Date().getFullYear()}`),
  body('construction_type')
    .isIn(CONSTRUCTION_TYPES)
    .withMessage(`Construction type must be one of: ${CONSTRUCTION_TYPES.join(', ')}`),
  body('security_system')
    .optional()
    .isBoolean()
    .withMessage('Security system must be a boolean')
];

module.exports = {
  propertyValidator
};
