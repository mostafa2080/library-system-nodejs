const express = require('express');
const router = express.Router();
const controller = require('../Controllers/GeneralReportController');
const { basicAdmin } = require('../Core/AuthenticationMw/Authorization');

router.route('/general/report').get(basicAdmin, controller.getAllReports);


module.exports = router;