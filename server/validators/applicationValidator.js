const { body } = require('express-validator');

const applicationValidator = [
  body('quoteId')
    .isInt({ gt: 0 })
    .withMessage('A valid quote ID is required')
];

const reviewValidator = [
  body('reviewNotes')
    .notEmpty()
    .withMessage('Review notes are required')
];

module.exports = {
  applicationValidator,
  reviewValidator
};
