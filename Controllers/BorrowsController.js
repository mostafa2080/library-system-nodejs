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

        await Books.updateOne(
            { _id: req.body.bookID },
            {
                $set: {},
            }
        );
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
                    //TODO change this to logged in employee ID
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
    return;
    const date = new Date();
    let banCount = 0;
    let unbanCount = 0;
    const unreturnedBorrows = await Borrows.find({
        // TODO test this
        // $where: `(this.returnDate>this.deadlineDate)||(this.returnDate==null&&${date}>this.deadlineDate)`
        $or: {
            $expr: { $gt: ["$returnDate", "$deadlineDate"] },
            $and: {
                $expr: { $eq: ["$returnDate", null] },
                $expr: { $gt: [date, "$deadlineDate"] },
            },
        },
    });
    unreturnedBorrows.forEach(async (borrow) => {
        await Members.updateOne(
            {
                _id: borrow._id,
            },
            {
                $set: {
                    isBanned: true,
                },
            }
        );
        banCount++;
        if (borrow.returnDate.setDate(borrow.returnDate + 7) < date) {
            await Members.updateOne(
                {
                    _id: borrow._id,
                },
                {
                    $set: {
                        isBanned: false,
                    },
                }
            );
            unbanCount++;
        }
    });
    console.log("Today's ban count:", banCount);
    console.log("Today's unban count", unbanCount);
};
