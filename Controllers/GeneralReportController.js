const express = require('express');
const router = express.Router();

// Import the individual report routes
const readingBooksController = require('./ReadingBooksController');
const AdministratorReportController = require('./AdministratorReportController');
const BooksReportController = require('./BooksReportController');
const employeeReportController = require('./EmployeeReportController');
const memberReportController = require('./MembersController');
// Define the general report route
getAllReports = async (req, res) => {
  try {
    const readingBooks = await readingBooksController.getAllReadingBooks();
    const administratorsReport = await AdministratorReportController();
    const borrowedBooksReport =
      await BooksReportController.borrowedBooksDetails();

    const newBooks = await BooksReportController.newArrivedBooks();
    const employeeReport = await employeeReportController.getReports();
    const memberReport = await memberReportController.getMembersReport();
    //add more report calls as needed

    const allReports = {
      readingBooks,
      administratorsReport,
      borrowedBooksReport,
      newBooks,
      employeeReport,
      memberReport,

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
