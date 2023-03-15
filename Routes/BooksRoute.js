const express = require("express");
const router = express.Router();
const controller = require("../Controllers/BooksController");
const validator = require("../Core/ValidationMW/BookValidation");

router
    .route("/books")
    .get(controller.getAllBooks)
    .post(validator.addValidator, controller.addBook)
    .put(validator.editValidator, controller.updateBook);

// router.get("/books/search", controller.searchBooks);
router.get(
    "/books/search/:keyword",
    validator.searchValidator,
    controller.searchBooks
);

router
    .route("/books/id/:_id")
    .get(validator.getValidator, controller.getBook)
    .delete(validator.deleteValidator, controller.deleteBook);

module.exports = router;
