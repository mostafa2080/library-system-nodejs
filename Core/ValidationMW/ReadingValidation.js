const { param } = require("express-validator");
exports.titleArray = [
  param("title").isString().withMessage("Enter a valid Title"),
];
