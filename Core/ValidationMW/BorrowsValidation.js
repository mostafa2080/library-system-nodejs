const { body, param } = require("express-validator");

exports.getValidator = [
    param("_id").isMongoId().withMessage("Enter a valid ID"),
];

exports.addValidator = [
    body("bookID").isMongoId().trim().withMessage("Enter valid book ID"),
    body("memberID").isMongoId().trim().withMessage("Enter valid member ID"),
    body("employeeID")
        .isMongoId()
        .trim()
        .withMessage("Enter valid employee ID"),
    body("borrowDate")
        .isDate()
        .trim()
        .default(Date.now)
        .withMessage("Borrow date is not valid"),
    body("returnDate").isDate().trim().withMessage("Return date is not valid"),
    body("deadlineDate")
        .isDate()
        .trim()
        .withMessage("Deadline date is not valid"),
];

exports.editValidator = [
    param("_id").isMongoId().withMessage("Enter a valid ID"),
    body("bookID").isMongoId().trim().withMessage("Enter valid book ID"),
    body("memberID").isMongoId().trim().withMessage("Enter valid member ID"),
    body("employeeID")
        .isMongoId()
        .trim()
        .withMessage("Enter valid employee ID"),
    body("borrowDate")
        .isDate()
        .trim()
        .withMessage("Borrow date is not valid"),
    body("returnDate").isDate().trim().withMessage("Return date is not valid"),
    body("deadlineDate")
        .isDate()
        .trim()
        .withMessage("Deadline date is not valid"),
];

exports.deleteValidator = [
    param("_id").isMongoId().withMessage("Enter a valid ID"),
];
