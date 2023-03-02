const { body } = require('express-validator');
exports.validateAdminstratorArray = [
  body('firstName')
    .isString()
    .withMessage('Adminstrator FirstName must be an String'),
  body('lastName')
    .isString()
    .withMessage('Adminstrator Last Name must be a String'),
  body('email')
    .isEmail()
    .withMessage('Adminstrator Email must be a valid Email'),
  body('password')
    .isLength({ min: 4 })
    .withMessage('Adminstrator Password must be a more than 4 elements'),
  body('birthDate').isString().withMessage('birth Date must be a Correct Date'),
  body('hireDate').isString().withMessage('Hire Date must be Correct Date'),
  body('image').isString().withMessage('Adminstrator Image must be a String'),
  body('salary')
    .isNumeric()
    .withMessage('Adminstrator Salary must be a Number'),
];

// Optional
exports.optValidateAdminstratorArray = [
  body('firstName')
    .optional()
    .isString()
    .withMessage('Adminstrator FirstName must be an String'),
  body('lastName')
    .optional()
    .isString()
    .withMessage('Adminstrator Last Name must be a String'),
  body('email')
    .optional()
    .isEmail()
    .withMessage('Adminstrator Email must be a valid Email'),
  body('password')
    .optional()
    .isLength({ min: 4 })
    .withMessage('Adminstrator Password must be a more than 4 elements'),
  body('birthDate') //"January 1, 1990, 00:00:00 UTC"
    .optional()
    .isString()
    .withMessage('birth Date must be a Correct Date'),
  body('hireDate') //"January 1, 1990, 00:00:00 UTC"
    .optional()
    .isString()
    .withMessage('Hire Date must be Correct Date'),
  body('image')
    .optional()
    .isString()
    .withMessage('Adminstrator Image must be a String'),
  body('salary')
    .optional()
    .isNumeric()
    .withMessage('Adminstrator Salary must be a Number'),
];
