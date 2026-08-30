const { body } = require('express-validator');

const quoteValidator = [
  body('propertyId')
    .isInt({ gt: 0 })
    .withMessage('A valid property ID is required'),
  body('planId')
    .isInt({ gt: 0 })
    .withMessage('A valid insurance plan ID is required')
];

module.exports = {
  quoteValidator
};
