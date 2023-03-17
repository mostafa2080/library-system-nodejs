const { body, param } = require("express-validator");

exports.getValidator = [
    param("_id").isMongoId().withMessage("Enter a valid ID"),
];

exports.addValidator = [
    body("title")
        .isString()
        .isLength({ min: 1, max: 100 })
        .trim()
        .withMessage("Book name must be between 1 and 100 characters"),
    body("author")
        .isString()
        .isLength({ min: 1, max: 100 })
        .trim()
        .withMessage("Author name must be between 1 and 100 characters"),
    body("publisher")
        .isString()
        .isLength({ min: 1, max: 100 })
        .trim()
        .withMessage("Publisher name must be between 1 and 100 characters"),
    body("dateAdded")
        .isDate()
        .trim()
        .optional()
        .withMessage("Date added is not valid"),
    body("datePublished")
        .isDate()
        .trim()
        .withMessage("Date published is not valid"),
    body("category")
        .isString()
        .trim()
        .isLength({ min: 1, max: 100 })
        .withMessage("Category name must be between 1 and 100 characters"),
    body("pagesCount")
        .isNumeric()
        .trim()
        .isLength({ min: 1, max: 1800 })
        .withMessage("Pages count must be between 1 and 1800"),
    body("copiesCount")
        .isNumeric()
        .trim()
        .isLength({ min: 1, max: 100 })
        .withMessage("Copies count must be between 1 and 1800"),
    body("isAvailable")
        .isBoolean()
        .trim()
        .withMessage("Enter book's availability"),
    body("shelfNo")
        .isNumeric()
        .trim()
        .isLength({ min: 1, max: 100 })
        .withMessage("Enter valid shelf Number"),
];

exports.editValidator = [
    param("_id").isMongoId().withMessage("Enter a valid ID"),
    body("title")
        .isString()
        .isLength({ min: 1, max: 100 })
        .trim()
        .withMessage("Book name must be between 1 and 100 characters"),
    body("author")
        .isString()
        .isLength({ min: 1, max: 100 })
        .trim()
        .withMessage("Author name must be between 1 and 100 characters"),
    body("publisher")
        .isString()
        .isLength({ min: 1, max: 100 })
        .trim()
        .withMessage("Publisher name must be between 1 and 100 characters"),
    body("dateAdded")
        .isDate()
        .trim()
        .optional()
        .withMessage("Date added is not valid"),
    body("datePublished")
        .isDate()
        .trim()
        .withMessage("Date published is not valid"),
    body("category")
        .isString()
        .trim()
        .isLength({ min: 1, max: 100 })
        .withMessage("Category name must be between 1 and 100 characters"),
    body("pagesCount")
        .isNumeric()
        .trim()
        .isLength({ min: 1, max: 1800 })
        .withMessage("Pages count must be between 1 and 1800"),
    body("copiesCount")
        .isNumeric()
        .trim()
        .isLength({ min: 1, max: 100 })
        .withMessage("Copies count must be between 1 and 1800"),
    body("isAvailable")
        .isBoolean()
        .trim()
        .withMessage("Enter book's availability"),
    body("shelfNo")
        .isNumeric()
        .trim()
        .isLength({ min: 1, max: 100 })
        .withMessage("Enter valid shelf Number"),
];

exports.deleteValidator = [
    param("_id").isMongoId().withMessage("Enter a valid ID"),
];

exports.searchValidator = [
    param("keyword")
        .isString()
        .isLength({ min: 1, max: 100 })
        .withMessage("Enter a valid keyword between 1 and 100 characters long"),
];
