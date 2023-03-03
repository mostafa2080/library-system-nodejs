const express = require("express");
const loginController = require("./../Controllers/LoginController");
const router = express.Router();
router.route("/login")
    .post(loginController);
module.exports = router;