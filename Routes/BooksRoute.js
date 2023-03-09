const express = require("express");
const controller = require("../Controllers/BooksController");
const router = express.Router();

router
    .route("/books")
    .get(controller.getAllBooks)
    .post(controller.addBook)
    .put(controller.updateBook);

router.get("/books/search", controller.searchBooks);

router
    .route("/books/id/:_id")
    .get(controller.getBook)
    .delete(controller.deleteBook);

module.exports = router;
