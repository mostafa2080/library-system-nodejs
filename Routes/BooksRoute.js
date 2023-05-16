const express = require("express");
const router = express.Router();
const controller = require("../Controllers/BooksController");
const validator = require("../Core/ValidationMW/BooksValidation");
const auth = require("../Core/AuthenticationMw/Authorization");

/**
 * @swagger
 * /books:
 *      get:
 *          description: Get all books
 *          responses:
 *              200:
 *                  description: Success
 *      post:
 *          description: Create a book
 *          responses:
 *              200:
 *                  description: Success
 *      
 */

router
    .route("/books")
    .get(controller.getAllBooks)
    .post(auth.adminOrAbove, validator.addValidator, controller.addBook);

/**
 * @swagger
 * /books/{_id}:
 *      get:
 *          description: Get a specific book
 *          responses:
 *              200:
 *                  description: Success
 *      patch:
 *          description: Edit a book
 *          responses:
 *              200:
 *                  description: Success
 *      delete:
 *          description: Delete a book
 *          responses:
 *              200:
 *                  description: Success
 *      
 */

router
    .route("/books/:_id")
    .get(validator.getValidator, controller.getBook)
    .patch(auth.adminOrAbove, validator.editValidator, controller.updateBook)
    .delete(
        auth.adminOrAbove,
        validator.deleteValidator,
        controller.deleteBook
    );

// router.get("/books/search", controller.searchBooks);

/**
 * @swagger
 * /books:
 *      get:
 *          description: Search for books
 *          responses:
 *              200:
 *                  description: Success
 *      
 */

router.get(
    "/books/search/:keyword",
    validator.searchValidator,
    controller.searchBooks
);

module.exports = router;
