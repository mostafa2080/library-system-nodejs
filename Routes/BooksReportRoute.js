const express = require('express');
const router = express.Router();
const BooksReportController = require('../Controllers/BooksReportController');
const validator = require('./../Core/ValidationMW/EmployeeValidation');
const auth = require('./../Core/AuthenticationMw/Authorization');


router.get('/books/borrowed', auth.adminOrAbove, BooksReportController.borrowedBooks);
router.get('/books/borrowed/details', auth.adminOrAbove, BooksReportController.borrowedBooksDetails);


router.get('/books/borrowed/:memberID', auth.adminOrAbove, BooksReportController.borrowedBooksByMember);
router.get('/books/borrowed/:memberID/count', auth.adminOrAbove, BooksReportController.numberBorrowedBooksByMember);


router.get('/books/mostBorrowed', auth.adminOrAbove, BooksReportController.mostBorrowedBooks);
router.get('/books/mostBorrowed/:memberID/count', auth.adminOrAbove, BooksReportController.mostBorrowedBooksByMember);
router.get('/books/newest', auth.adminOrAbove, BooksReportController.newArrivedBooks);

router.get('/books/read', auth.adminOrAbove, BooksReportController.readBooks);
router.get('/books/read/:memberID', auth.adminOrAbove, BooksReportController.readBooksByMember);
router.get('/books/mostRead', auth.adminOrAbove, BooksReportController.mostReadBooks);



module.exports = router;