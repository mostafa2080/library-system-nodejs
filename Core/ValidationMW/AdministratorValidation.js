const { body } = require("express-validator");
exports.getValidationArray = [
  body("email")
    .isEmail()
    .withMessage("Administrator Email must be a valid Email"),
];
exports.addValidationArray = [
  body("email")
    .isEmail()
    .withMessage("Administrator Email must be a valid Email"),
  body("password")
    .isStrongPassword()
    .isLength({ min: 4 })
    .withMessage("Administrator Password must be a more than 4 elements"),
  body("salary")
    .isNumeric()
    .withMessage("Administrator Salary must be a Number"),
];
exports.updateValidationArray = [
  body("firstName")
    .optional()
    .isString()
    .withMessage("Administrator FirstName must be an String"),
  body("lastName")
    .optional()
    .isString()
    .withMessage("Administrator Last Name must be a String"),
  body("email")
    .optional()
    .isEmail()
    .withMessage("Administrator Email must be a valid Email"),
  body("password")
    .isStrongPassword()
    .optional()
    .isLength({ min: 4 })
    .withMessage("Administrator Password must be a more than 4 elements"),
  body("birthDate") //"January 1, 1990, 00:00:00 UTC"
    .optional()
    .isDate()
    .withMessage("birth Date must be a Correct Date"),
  body("hireDate") //"January 1, 1990, 00:00:00 UTC"
    .optional()
    .isDate()
    .withMessage("Hire Date must be Correct Date"),
  body("image")
    .optional()
    .isString()
    .withMessage("Administrator Image must be a String"),
  body("salary")
    .optional()
    .isNumeric()
    .withMessage("Administrator Salary must be a Number"),
];
exports.deleteValidationArray = [
  body("email")
    .isEmail()
    .withMessage("Administrator Email must be a valid Email"),
];
