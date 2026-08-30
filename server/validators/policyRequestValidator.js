const { body } = require('express-validator');

const policyRequestValidator = [
  body('policyId')
    .isInt({ gt: 0 })
    .withMessage('A valid policy ID is required'),
  body('requestType')
    .isIn(['ADDRESS_CHANGE', 'ADD_COVERAGE', 'REMOVE_COVERAGE', 'RENEWAL', 'CANCELLATION'])
    .withMessage('Invalid request type'),
  body('description')
    .notEmpty()
    .withMessage('Description is required')
];

module.exports = {
  policyRequestValidator
};
