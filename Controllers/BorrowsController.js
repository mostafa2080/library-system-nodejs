const mongoose = require("mongoose");
require("../Model/BooksModel");
require("../Model/BorrowsModel");

const Books = mongoose.model("books");
const Borrows = mongoose.model("borrows");

exports.getAllBorrows = async (req, res, next) => {
    try {
        const results = await Borrows.find({});
        res.status(200).json({ results });
    } catch (err) {
        next(err);
    }
};

exports.getBorrow = async (req, res, next) => {
    try {
        const result = await Borrows.findOne({ _id: req.params._id });
        res.status(200).json({ result });
    } catch (err) {
        next(err);
    }
};

exports.addBorrow = async (req, res, next) => {
    try {
        const date = new Date();
        const twoDaysDeadlineDate = date.setDate(date + 2);
        const result = await new Borrows({
            bookID: req.body.bookID,
            memberID: req.body.memberID,
            employeeID: req.body.employeeID,
            borrowDate: date,
            returnDate: null,
            deadlineDate: req.body.deadlineDate || twoDaysDeadlineDate,
        }).save();

        res.status(201).json({ result });
    } catch (err) {
        next(err);
    }
};
exports.updateBorrow = async (req, res, next) => {
    try {
        const result = await Borrows.updateOne(
            { _id: req.params._id },
            {
                $set: {
                    bookID: req.body.bookID,
                    memberID: req.body.memberID,
                    employeeID: req.body.employeeID,
                    borrowDate: req.body.borrowDate,
                    returnDate: req.body.returnDate,
                    deadlineDate: req.body.deadlineDate,
                },
            }
        );
        res.status(200).json({ result });
    } catch (err) {
        next(err);
    }
};

exports.deleteBorrow = async (req, res, next) => {
    try {
        const result = await Borrows.deleteOne({ _id: req.params._id });
        if (result.deletedCount == 0) next(new Error("Borrow not found"));
        else {
            res.status(200).json({ result });
        }
    } catch (err) {
        next(err);
    }
};
