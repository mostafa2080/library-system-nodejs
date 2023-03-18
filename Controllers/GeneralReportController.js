const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// Import the individual report routes
const readingBooksController = require('./ReadingBooksController');
const AdministratorReportController = require('./AdministratorReportController');
const BooksReportController = require('./BooksReportController');
const employeeReportController = require('./EmployeeReportController');
const memberReportController = require('./MembersController');

const ReadingBookReportSchema = mongoose.model("readingBooksReport");
const AdminReportSchema = mongoose.model("administratorsReport");
const EmployeeReports = mongoose.model('EmployeeReports');
const MembersReport=mongoose.model("membersReport");
// Define the general report route
getAllReports = async (req, res) => {
  try {
    const readingBooks = await ReadingBookReportSchema.find();
    const administratorsReport = await AdminReportSchema.find();
    /*const borrowedBooksReport =
      await BooksReportController.borrowedBooksDetails();*/

    //const newBooks = await BooksReportController.newArrivedBooks();
    const employeeReport = await EmployeeReports.find();
    const memberReport = await MembersReport.find();
    //add more report calls as needed

    const allReports = {
      readingBooks:readingBooks,
      administratorsReport: administratorsReport,
      employeeReport:employeeReport,
      memberReport:memberReport

      //add more report data as needed
    };

    return res.status(200).json({ success: true, data: allReports });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, error: 'Error Reading General Reports' });
  }
};

module.exports = { router, getAllReports };
