const { body, param } = require("express-validator");
exports.getValidationArray = [
  param("id").isMongoId().withMessage("Administrator Id must be a valid Id"),
];
exports.addValidationArray = [
  body("firstName")
    .isString()
    .withMessage("Administrator FirstName must be an String"),
  body("lastName")
    .isString()
    .withMessage("Administrator Last Name must be a String"),
  body("email")
    .isEmail()
    .withMessage("Administrator Email must be a valid Email"),
  body("password")
    .optional()
    .isString()
    .isLength({ min: 8, max: 20 })
    .withMessage("Password must be between 8 and 20 characters"),
  body("salary")
    .isNumeric()
    .withMessage("Administrator Salary must be a Number"),
  body("image")
    .optional()
    .isString()
    .withMessage("Administrator Image must be a String"),
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
  // body("password")
  //   .isStrongPassword()
  //   .optional()
  //   .isLength({ min: 4 })
  //   .withMessage("Administrator Password must be a more than 4 elements"),
  // body("birthday") //"January 1, 1990, 00:00:00 UTC"
  //   .optional()
  //   .isDate()
  //   .withMessage("Birthday is not valid"),
  body("hireDate")
    .optional()
    .trim()
    .isDate()
    .withMessage("Hire date is not valid"),
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
