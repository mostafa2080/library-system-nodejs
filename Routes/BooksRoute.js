const express = require("express");
const router = express.Router();
const controller = require("../Controllers/BooksController");
const validator = require("../Core/ValidationMW/BooksValidation");
const auth = require("../Core/AuthenticationMw/Authorization");

router
    .route("/books")
    .get(controller.getAllBooks)
    .post(auth.adminOrAbove, validator.addValidator, controller.addBook);

router
    .route("/books/id/:_id")
    .get(validator.getValidator, controller.getBook)
    .patch(auth.adminOrAbove, validator.editValidator, controller.updateBook)
    .delete(
        auth.adminOrAbove,
        validator.deleteValidator,
        controller.deleteBook
    );

// router.get("/books/search", controller.searchBooks);
router.get(
    "/books/search/:keyword",
    validator.searchValidator,
    controller.searchBooks
);

module.exports = router;
