const express = require("express");
const router = express.Router();
const controller = require("../Controllers/BooksController");
const validator = require("../Core/ValidationMW/BookValidation");
const auth = require("../Core/AuthenticationMw/Authorization");

router
    .route("/books")
    .get(controller.getAllBooks)
    .post(auth.adminOrAbove, validator.addValidator, controller.addBook)
    .put(auth.adminOrAbove, validator.editValidator, controller.updateBook);

// router.get("/books/search", controller.searchBooks);
router.get(
    "/books/search/:keyword",
    validator.searchValidator,
    controller.searchBooks
);

router
    .route("/books/id/:_id")
    .get(validator.getValidator, controller.getBook)
    .delete(
        auth.adminOrAbove,
        validator.deleteValidator,
        controller.deleteBook
    );

module.exports = router;
