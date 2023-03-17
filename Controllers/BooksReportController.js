const mongoose = require('mongoose');

const Books = mongoose.model('books');
const Borrow = mongoose.model('borrows');


exports.borrowedBooks =  (req, res,next) => {
    Borrow.find({returnDate: null}).countDocuments((err, count) => {
        if (err) {
           next(err);
        } else {
            res.status(200).json({count: count});
        }
    });
};

exports.borrowedBooksDetails =  (req, res,next) => {
    Borrow.find({returnDate: null})
        .then((borrows) => {
            res.status(200).json(borrows);
        })
        .catch((err) => {
            next(err);
    });
};

exports.borrowedBooksByMember = (req, res, next) => {
    Borrow.find({memberID: req.params.memberID, returnDate: null})
        .then((borrows) => {
            res.status(200).json(borrows);
        })
        .catch((err) => {
            next(err);
        });
};

exports.numberBorrowedBooksByMember = (req, res, next) => {
    Borrow.find({memberID: req.params.memberID, returnDate: null})
        .countDocuments((err, count) => {
            if (err) {
                next(err);
            } else {
                res.status(200).json({count: count});
            }
        });
};

exports.mostBorrowedBooks = async (req, res, next) => {
    const data = await Borrow.aggregate([
        {
            $match: {returnDate: {$ne: null}}
        },
        {
            $group: {
                _id: "$bookID",
                count: {$sum: 1},
            },
        },
        {
            $sort: {count: -1},
        },
        {
            $limit: 5,
        },
    ])

    const populatedData = await Books.populate(data, {path: '_id', select: 'title'})
        .then((borrows) => {
            res.status(200).json(borrows);
        })
        .catch((err) => {
            next(err);
        });
}

exports.mostBorrowedBooksByMember = async(req, res, next) => {
    const data = await Borrow.aggregate([
        {
            $match: {memberID: req.params.memberID},
        },
        {
            $group: {
                _id: "$bookID",
                count: {$sum: 1},
            },
        },
        {
            $sort: {count: -1},
        },
        {
            $limit: 5,
        },
    ])

    const populatedData = await Books.populate(data, {path: '_id', select: 'title'})
        .then((data) => {
            res.status(200).json(data);
        })
        .catch((err) => {
            next(err);
        });
}

exports.newArrivedBooks = (req, res, next) => {
    let today = new Date();
    let lastWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 7);
    Books.find({createdAt: {$gte: lastWeek}})
        .then((borrows) => {
            res.status(200).json(borrows);
        })
        .catch((err) => {
            next(err);
        });
}


/*--------------------------------------------------------------------------------------*/

exports.readBooks =  (req, res,next) => {
    let today = new Date();
    Read.find({readDate: today}).countDocuments((err, count) => {
        if (err) {
           next(err);
        } else {
            res.status(200).json(count);
        }
    });
};

exports.readBooksByMember = (req, res, next) => {
    let today = new Date();
    Read.find({memberID: req.params.memberID, readDate: today})
        .then((reads) => {
            res.status(200).json(reads);
        })
        .catch((err) => {
            next(err);
        }); 
};

exports.mostReadBooks = async (req, res, next) => {
    let today = new Date();
    const data = await Read.aggregate([
        {
            $match: {readDate: today},
        },
        {
            $group: {
                _id: "$bookID",
                count: {$sum: 1},
            },
        },
        {
            $sort: {count: -1},
        },
        {
            $limit: 5,
        },
    ])
    const populatedData = await Books.populate(data, {path: '_id', select: 'title'})
        .then((reads) => {
            res.status(200).json(reads);
        })
        .catch((err) => {
            next(err);
        });
}