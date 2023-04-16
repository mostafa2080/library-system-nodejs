const mongoose = require('mongoose');
require('../Model/BooksModel');
require('../Model/BorrowsModel');
require('../Model/MembersModel');
require('../Model/ReadingBooksModel');

const Books = mongoose.model('books');
const Borrows = mongoose.model('borrows');
const Members = mongoose.model('members');
const ReadingBooks = mongoose.model('readingBooks');

//Retrieve all the records from the Borrows collection
exports.getAllBorrows = async (req, res, next) => {
    try {
        const results = await Borrows.find({})
            .populate('book')
            .populate('member')
            .populate('employee');
        res.status(200).json({ results });
    } catch (err) {
        next(err);
    }
};

//Retrieve a specific record from the Borrows collection
exports.getBorrow = async (req, res, next) => {
    try {
        const result = await Borrows.findOne({ _id: req.params._id });
        res.status(200).json({ result });
    } catch (err) {
        next(err);
    }
};
//Add a new record to the Borrows collection
exports.addBorrow = async (req, res, next) => {
    const errors = await borrowErrors(req, res, next);
    if (errors) {
        res.status(403).json({
            errors,
        });
        return;
    }
    try {
        const date = new Date();
        const twoDaysDeadlineDate = date.setDate(date.getDate() + 2);
        const borrow = await new Borrows({
            book: req.body.book,
            member: req.body.member,
            employee: req.body.employee,
            borrowDate: date.now,
            returnDate: null,
            deadlineDate:
                req.body.deadlineDate ||
                new Date(twoDaysDeadlineDate).toISOString(),
        }).save();

        const book = await Books.findOne(
            {
                _id: borrow.book,
            },
            { copiesCount: 1, title: 1 }
        );

        //Finds the count of all active borrows for a specific book
        if (this.totalAvailableCopies <= 0) {
            await Books.updateOne(
                { _id: borrow.book },
                {
                    $set: {
                        isAvailable: false,
                    },
                }
            );
            res.status(200).json({
                borrow,
                message: `Book: ${book.title} is not available anymore.`,
            });
        }
        const result = await Borrows.findOne({ _id: borrow._id })
            .populate('book')
            .populate('employee')
            .populate('member');

        res.status(201).json({ result });
    } catch (err) {
        next(err);
    }
};
// Update a borrow record in  database
exports.updateBorrow = async (req, res, next) => {
    try {
        const result = await Borrows.findOneAndUpdate(
            { _id: req.params._id },
            {
                $set: {
                    book: req.body.book,
                    member: req.body.member,
                    employee: req.body.employee,
                    returnDate: req.body.returnDate,
                    deadlineDate: req.body.deadlineDate,
                },
            },
            { new: true }
        )
            .populate('book')
            .populate('member')
            .populate('employee');
        //Find a Book
        const book = await Books.findOne(
            {
                _id: result.book,
            },
            { copiesCount: 1, title: 1 }
        );

        if (this.totalAvailableCopies > 0) {
            await Books.updateOne(
                { _id: result.book },
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
                { _id: result.book },
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

//Return a Book
exports.deleteBorrow = async (req, res, next) => {
    try {
        const result = await Borrows.findOneAndDelete({ _id: req.params._id });
        if (!result) throw new Error('Borrow not found');

        const book = await Books.findOne({
            _id: result.book,
            isAvailable: false,
        });

        if (book) {
            await Books.updateOne(
                {
                    _id: result.book,
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

//Check if a member can borrow a book
const borrowErrors = async (req, res, next) => {
    errors = {};
    const book = await Books.findOne({
        _id: req.body.book,
        isAvailable: true,
    });

    if (!book) errors.book = 'Book Not Found.';

    const member = await Members.findOne({
        _id: req.body.member,
    });

    if (!member) errors.member = 'Member Not Found.';

    const unreturnedBorrows = await unreturnedBorrowsOfSameBookCount(
        req,
        res,
        next
    );

    const availableCopies = await this.totalAvailableCopies(req.body.book);
    console.log(availableCopies);
    if (unreturnedBorrows !== 0) {
        errors.unreturned = "Member hasn't returned this book yet.";
    }

    if (availableCopies <= 1) {
        errors.copies = 'Insufficient number of copies.';
    }

    if (member.isBanned) {
        errors.banned = 'Member is banned.';
    }

    return errors;
};
//count the number of unreturned Borrows
const unreturnedBorrowsOfSameBookCount = async (req, res, next) =>
    await Borrows.find({
        book: req.body.book,
        member: req.body.member,
        returnDate: null,
    }).count();

//checks for unreturned borrows and returned borrows that are overdue and updates the corresponding members to set the isBanned flag to true or false accordingly
exports.bansCheckCycle = async () => {
    const date = new Date().toISOString();
    try {
        const unreturnedBorrows = await Borrows.find({
            returnDate: null,
            $expr: { $lt: ['$deadlineDate', date] },
        });

        unreturnedBorrows.forEach(async (borrow) => {
            const result = await Members.findOneAndUpdate(
                {
                    _id: borrow.member,
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
            $expr: { $gt: ['$returnDate', '$deadlineDate'] },
        });

        returnedBorrowsAfterDeadline.forEach(async (borrow) => {
            if (borrow.returnDate.setDate(borrow.returnDate + 7) > date) {
                const result = await Members.findOneAndUpdate(
                    {
                        _id: borrow.member,
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
                        _id: borrow.member,
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
    console.log('Ban/unban cycle complete at:', d.toLocaleString());
};

exports.totalAvailableCopies = async (bookID) => {
    const book = await Books.findOne({
        _id: bookID,
    });

    const totalCopies = book.copiesCount;

    const borrowedCopiesCount = await Borrows.find({
        book: bookID,
        returnDate: null,
    }).count();

    const readingCopiesCount = await ReadingBooks.find({
        book: bookID,
        returned: false,
    }).count();

    return totalCopies - (borrowedCopiesCount + readingCopiesCount);
};
