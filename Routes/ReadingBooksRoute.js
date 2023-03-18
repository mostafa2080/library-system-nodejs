const express = require("express");
const router = express.Router();
const readingBooksController = require("./../Controllers/ReadingBooksController");
const auth = require("./../Core/AuthenticationMw/Authorization");
const { titleArray } = require("./../Core/ValidationMW/ReadingValidation");
const validator = require("./../Core/ValidationMW/validateMW");

router
  .route("/reading")
  .get(auth.memberOrAbove, readingBooksController.getAllReadingBooks);

router
  .route("/reading/:_id")
  .post(
    auth.employeeOrAbove,
    titleArray,
    validator,
    readingBooksController.addReadingBook
  )
  .patch(
    auth.employeeOrAbove,
    titleArray,
    validator,
    readingBooksController.returningReadBooks
  );

router
  .route("/report/readingBook")
  .get(auth.memberOrAbove, readingBooksController.getReadingBookReport);

module.exports = router;
