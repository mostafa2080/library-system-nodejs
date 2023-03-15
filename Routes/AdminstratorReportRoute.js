const express = require("express");
const router = express.Router();
const adminstratorsReportController = require("../Controllers/AdministratorReportController");

router.route("/Report/Administrator").get(adminstratorsReportController);

module.exports = router;
