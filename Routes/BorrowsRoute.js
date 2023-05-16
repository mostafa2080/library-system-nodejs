const express = require("express");
const router = express.Router();
const controller = require("../Controllers/BorrowsController");
const validator = require("../Core/ValidationMW/BorrowsValidation");
const auth = require("../Core/AuthenticationMw/Authorization");

router
    .route("/borrows")
    .get(auth.employeeOrAbove, controller.getAllBorrows)
    .post(auth.employeeOrAbove, validator.addValidator, controller.addBorrow);

router
    .route("/borrows/:_id")
    .patch(auth.employeeOrAbove, validator.editValidator, controller.updateBorrow)
    .delete(auth.employeeOrAbove, validator.deleteValidator, controller.deleteBorrow);

module.exports = router;
