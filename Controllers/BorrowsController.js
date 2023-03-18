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

exports.addBorrow = async (req, res, next) => {
    const continueWithBorrow = await canBorrow(req, res, next);
    if (!continueWithBorrow) {
        res.status(403).json({
            message: "Can't borrow.",
        });
        return;
    }
    try {
        const book = await Books.findOne(
            {
                _id: result.bookID,
            },
            { copiesCount: 1, title: 1 }
        );

        const borrowedCopiesCount = await Borrows.find({
            bookID: result.bookID,
            returnDate: null,
        }).count();

        if (book.copiesCount - borrowedCopiesCount <= 1) {
            await Books.updateOne(
                { _id: result.bookID },
                {
                    $set: {
                        isAvailable: false,
                    },
                }
            );
            res.status(200).json({
                result,
                message: `Book: ${book.title} is not available anymore.`,
            });
        }

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

        const book = await Books.findOne(
            {
                _id: result.bookID,
            },
            { copiesCount: 1, title: 1 }
        );

        const borrowedCopiesCount = await Borrows.find({
            bookID: result.bookID,
            returnDate: null,
        }).count();

        if (book.copiesCount - borrowedCopiesCount > 1) {
            await Books.updateOne(
                { _id: result.bookID },
                {
                    $set: {
                        isAvailable: true,
                    },
                }
            );

            res.status(200).json({
                result,
                message: `Book: ${book.title} is now available again.`,
            });
        } else {
            await Books.updateOne(
                { _id: result.bookID },
                {
                    $set: {
                        isAvailable: false,
                    },
                }
            );
            res.status(200).json({ result });
        }
    } catch (err) {
        next(err);
    }
};

exports.deleteBorrow = async (req, res, next) => {
    try {
        const result = await Borrows.findOneAndDelete({ _id: req.params._id });
        if (!result) throw new Error("Borrow not found");

        const book = await Books.findOne({
            _id: result.bookID,
            isAvailable: false,
        });

        if (book) {
            await Books.updateOne(
                {
                    _id: result.bookID,
                    isAvailable: false,
                },
                {
                    $set: {
                        isAvailable: true,
                    },
                }
            );
            res.status(200).json({
                result,
                message: `Book: ${book.title} is now available again.`,
            });
        }

        res.status(200).json({ result });
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

    const borrowedCopiesCount = await Borrows.find({
        bookID: req.body.bookID,
        returnDate: null,
    }).count();

    if (
        unreturnedBorrows === 0 &&
        book.copiesCount - borrowedCopiesCount > 1 &&
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

    const d = new Date();
    console.log("Ban/unban cycle complete at:", d.toLocaleString());
};
