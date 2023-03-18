const mongoose = require('mongoose');
const EmployeeReports = mongoose.model('EmployeeReports');

// Get all Employee Reports
exports.getReports = (req, res, next) => {
    EmployeeReports.find()
    .then((data) => {
        res.status(200).json({ data });
    })
    .catch((err) => {
        next(err);
    });
}