const express = require("express");
const loginController = require("./../Controllers/LoginController");
const EmployeeController = require("./../Controllers/EmployeeController");
const EmployeeValidation = require("./../Core/ValidationMW/EmployeeValidation");
const router = express.Router();
router.route("/login/administrator").post(loginController);

router.post(
  "/employeeLogin",
  EmployeeValidation.loginValidator,
  EmployeeController.loginEmployee
);

module.exports = router;
