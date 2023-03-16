const express = require("express");
const loginController = require("./../Controllers/LoginController");
const EmployeeController = require("./../Controllers/EmployeeController");
const EmployeeValidation = require("./../Core/ValidationMW/EmployeeValidation");
const MembersController = require("./../Controllers/MembersController");
const MembersValidator=require("./../Core/ValidationMW/MembersValidator");
const { body } = require("express-validator");
const router = express.Router();
router.route("/login/administrator").post(loginController);

router.post(
  "/login/employee",
  EmployeeValidation.loginValidator,
  EmployeeController.loginEmployee
);

router.post("/login/member",MembersValidator.membersLoginValidator,MembersController.MemberLogin);
/***************** Register Members Login Route ***************/


module.exports = router;
