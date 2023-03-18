const express = require("express");
const router = express.Router();
const readingBooksController = require("./../Controllers/ReadingBooksController");
const auth = require("./../Core/AuthenticationMw/Authorization");
const { titleArray } = require("./../Core/ValidationMW/ReadingValidation");
const validator = require("./../Core/ValidationMW/validateMW");

router
  .route("/reading/:title")
  .get(
    auth.memberOrAbove,
    titleArray,
    validator,
    readingBooksController.gettingReadingBooks
  )
  .patch(
    auth.employeeOrAbove,
    titleArray,
    validator,
    readingBooksController.addReadingBook
  )
  .delete(
    auth.employeeOrAbove,
    titleArray,
    validator,
    readingBooksController.returningReadBooks
  );

router
  .route("/reading")
  .get(
    auth.memberOrAbove,
    titleArray,
    validator,
    readingBooksController.getAllReadingBooks
  );

module.exports = router;
