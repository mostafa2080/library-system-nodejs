const { param } = require("express-validator");
exports.titleArray = [
  param("_id").isMongoId().withMessage("Enter a valid _id Of Book"),
];
