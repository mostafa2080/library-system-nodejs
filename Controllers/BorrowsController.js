const mongoose = require("mongoose");
require("../Model/BooksModel");
require("../Model/BorrowsModel");
require("../Model/membersModel");

const Books = mongoose.model("books");
const Borrows = mongoose.model("borrows");
const Members = mongoose.model("members");

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
// TODO get member's borrowed books
// TODO number of borrowed book (same member and book)
// TODO created_at field to show recently arrived books
exports.addBorrow = async (req, res, next) => {
    const continueWithBorrow = await canBorrow(req, res, next);
    if (!continueWithBorrow) {
        res.status(403).json({
            message: "Can't borrow.",
        });
        return;
    }
    try {
        const date = new Date();
        const twoDaysDeadlineDate = date.setDate(date + 2);
        const result = await new Borrows({
            bookID: req.body.bookID,
            memberID: req.body.memberID,
            employeeID: req.body.employeeID,
            borrowDate: date.now,
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
        const result = await Borrows.findOneAndUpdate(
            { _id: req.params._id },
            {
                $set: {
                    bookID: req.body.bookID,
                    memberID: req.body.memberID,
                    employeeID: req.body.employeeID,
                    returnDate: req.body.returnDate,
                    deadlineDate: req.body.deadlineDate,
                },
            },
            { new: true }
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

const canBorrow = async (req, res, next) => {
    const book = await Books.findOne({
        _id: req.body.bookID,
        isAvailable: true,
    });

    if (!book) return false;

    const member = await Members.findOne({
        _id: req.body.memberID,
        isBanned: false,
    });

    if (!member) return false;
    const unreturnedBorrows = await unreturnedBorrowsOfSameBookCount(
        req,
        res,
        next
    );
    const copiesCount = await totalCurrentlyBorrowedCopiesOfBookCount(
        req,
        res,
        next
    );
    // TODO change availability if book can't be borrowed anymore
    if (
        unreturnedBorrows === 0 &&
        book.copiesCount - copiesCount > 1 &&
        !member.isBanned
    ) {
        return true;
    }
    return false;
};

const unreturnedBorrowsOfSameBookCount = async (req, res, next) =>
    await Borrows.find({
        bookID: req.body.bookID,
        memberID: req.body.memberID,
        returnDate: null,
    }).count();

const totalCurrentlyBorrowedCopiesOfBookCount = async (req, res, next) => {
    return await Borrows.find({
        bookID: req.body.bookID,
        returnDate: null,
    });
};

exports.bansCheckCycle = async () => {
    const date = new Date().toISOString();
    try {
        const unreturnedBorrows = await Borrows.find({
            returnDate: null,
            $expr: { $lt: ["$deadlineDate", date] },
        });

        unreturnedBorrows.forEach(async (borrow) => {
            const result = await Members.findOneAndUpdate(
                {
                    _id: borrow.memberID,
                },
                {
                    $set: {
                        isBanned: true,
                    },
                },
                { new: true }
            );
        });
    } catch (err) {
        console.log(err);
    }
    try {
        const returnedBorrowsAfterDeadline = await Borrows.find({
            $expr: { $gt: ["$returnDate", "$deadlineDate"] },
        });

        returnedBorrowsAfterDeadline.forEach(async (borrow) => {
            if (borrow.returnDate.setDate(borrow.returnDate + 7) > date) {
                const result = await Members.findOneAndUpdate(
                    {
                        _id: borrow.memberID,
                    },
                    {
                        $set: {
                            isBanned: true,
                        },
                    },
                    { new: true }
                );
            } else {
                const result = await Members.findOneAndUpdate(
                    {
                        _id: borrow.memberID,
                    },
                    {
                        $set: {
                            isBanned: false,
                        },
                    },
                    { new: true }
                );
            }
        });
    } catch (err) {
        console.log(err);
    }
    console.log("Ban/unban cycle complete.");
};
