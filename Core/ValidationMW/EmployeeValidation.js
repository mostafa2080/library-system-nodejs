const { body, param } = require('express-validator');

exports.addValidator = [
    body('firstName').isString().isLength({min:3, max:20}).trim().withMessage('First name must be between 3 and 20 characters'),
    body('lastName').isString().isLength({min:3, max:20}).trim().withMessage('Last name must be between 3 and 20 characters'),
    body('email').isEmail().withMessage('Email is not valid'),
    body('password').isString().isLength({min:8, max:20}).withMessage('Password must be between 8 and 20 characters'),
    body('birthDate').isDate().withMessage('Birth date is not valid'),
    body('hireDate').isDate().withMessage('Hire date is not valid'),
    body('salary').isNumeric().withMessage('Salary is not valid'),
    body("image").optional()
];

exports.editValidator = [
    body('_id').isMongoId().withMessage('Id is not valid'),
    body('firstName').optional().isString().isLength({min:3, max:20}).trim().withMessage('First name must be between 3 and 20 characters'),
    body('lastName').optional().isString().isLength({min:3, max:20}).trim().withMessage('Last name must be between 3 and 20 characters'),
    body('email').optional().isEmail().withMessage('Email is not valid'),
    body('password').optional().isString().isLength({min:8, max:20}).withMessage('Password must be between 8 and 20 characters'),
    body('birthDate').optional().isDate().withMessage('Birth date is not valid'),
    body('hireDate').optional().isDate().withMessage('Hire date is not valid'),
    body('salary').optional().isNumeric().withMessage('Salary is not valid'),
];

exports.deleteValidator = [
    param('_id').isMongoId().withMessage('Id is not valid'),
];

exports.getValidator = [
    param('_id').isMongoId().withMessage('Id is not valid'),
];

exports.loginValidator = [
    body('email').isEmail().withMessage('Email is not valid'),
    body('password').isString().withMessage('Password must be between 8 and 20 characters'),
];

