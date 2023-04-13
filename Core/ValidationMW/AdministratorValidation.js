const { body, param } = require("express-validator");
exports.getValidationArray = [
  param("id").isMongoId().withMessage("Administrator Id must be a valid Id"),
];
exports.addValidationArray = [
  body("firstName").isString().withMessage("First Name is Required"),
  body("lastName").isString().withMessage("Last Name is Required"),
  body("email")
    .isEmail()
    .withMessage("Email must be a valid Email & Not duplicated"),
  body("password")
    .optional()
    .isString()
    .isLength({ min: 8, max: 20 })
    .withMessage("Password must be between 8 and 20 characters"),
  body("salary").isNumeric().withMessage("Salary must be a Number"),
  body("birthday") //"January 1, 1990, 00:00:00 UTC"
    .isISO8601()
    .withMessage("Birthday must be in date format...!"),
  body("hireDate")
    .isISO8601()
    .withMessage("Hire Date must be in date format...!"),
  body("image").optional().isString().withMessage("Image must be a String"),
];
exports.updateValidationArray = [
  param("id").isMongoId().withMessage("Administrator Id must be a valid Id"),
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
    .optional()
    .isString()
    .isLength({ min: 8, max: 20 })
    .withMessage("Password must be between 8 and 20 characters"),
  body("birthday") //"January 1, 1990, 00:00:00 UTC"
    .optional()
    .isISO8601()
    .withMessage("Birthday must be in date format...!"),
  body("hireDate")
    .optional()
    .isISO8601()
    .withMessage("Hire Date must be in date format...!"),
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
  param("id").isMongoId().withMessage("Administrator Id must be a valid Id"),
];
