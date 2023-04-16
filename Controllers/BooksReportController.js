const mongoose = require('mongoose');

const Books = mongoose.model('books');
const Borrow = mongoose.model('borrows');
const Read = mongoose.model('readingBooks');

// number of books that are currently borrowed by users and not yet returned
exports.borrowedBooks = (req, res, next) => {
  Borrow.find({ returnDate: null }).countDocuments((err, count) => {
    if (err) {
      next(err);
    } else {
      res.status(200).json({ count: count });
    }
  });
};
//Details of all books that have been borrowed but not yet returned
exports.borrowedBooksDetails = (req, res, next) => {
  Borrow.find({ returnDate: null })
    .then((borrows) => {
      res.status(200).json(borrows);
    })
    .catch((err) => {
      next(err);
    });
};
//Retrieve all the currently borrowed books by a specific member
exports.borrowedBooksByMember = (req, res, next) => {
  Borrow.find({ member: req.params.member, returnDate: null })
    .then((borrows) => {
      res.status(200).json(borrows);
    })
    .catch((err) => {
      next(err);
    });
};

//Get the number of borrowed books by a member with a given member ID
exports.numberBorrowedBooksByMember = (req, res, next) => {
  Borrow.find({
    member: req.params.member,
    returnDate: null,
  }).countDocuments((err, count) => {
    if (err) {
      next(err);
    } else {
      res.status(200).json({ count: count });
    }
  });
};

//Group the books by their IDs, count the number of times each book has been borrowed, sort the results in descending order based on the count, and finally return the top 5 most borrowed books.
exports.mostBorrowedBooks = async (req, res, next) => {
  const data = await Borrow.aggregate([
    {
      $match: { returnDate: { $ne: null } },
    },
    {
      $group: {
        _id: '$book',
        count: { $sum: 1 },
      },
    },
    {
      $sort: { count: -1 },
    },
    {
      $limit: 5,
    },
  ]);

  // Fetch Books data from database
  const populatedData = await Books.populate(data, {
    path: '_id',
    select: 'title',
  })
    .then((borrows) => {
      res.status(200).json(borrows);
    })
    .catch((err) => {
      next(err);
    });
};
//Fetch the top 5 most borrowed books by a member
exports.mostBorrowedBooksByMember = async (req, res, next) => {
  const data = await Borrow.aggregate([
    {
      $match: { member: req.params.member },
    },
    {
      $group: {
        _id: '$book',
        count: { $sum: 1 },
      },
    },
    {
      $sort: { count: -1 },
    },
    {
      $limit: 5,
    },
  ]);

  const populatedData = await Books.populate(data, {
    path: '_id',
    select: 'title',
  })
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((err) => {
      next(err);
    });
};

//Fetch the books that were added to the database in the last week.
exports.newArrivedBooks = (req, res, next) => {
  let today = new Date();
  let lastWeek = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate() - 7
  );
  Books.find({ dateAdded: { $gte: lastWeek } })
    .then((borrows) => {
      res.status(200).json(borrows);
    })
    .catch((err) => {
      next(err);
    });
};

/*--------------------------------------------------------------------------------------*/
//Count the number of books that have been marked as read today
exports.readBooks = async (req, res, next) => {
  let today = new Date();
  let yesterday = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate() - 1
  );
  const data = await Read.find({ date: {$gte : yesterday} });
  const populatedData = await Books.populate(data, {
    path: 'book',
    select: 'title',
  })
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((err) => {
      next(err);
    });
};

//Find the books read by a specific member today
exports.readBooksByMember = async (req, res, next) => {
  const data = await Read.find({ member: req.params.member });
    const populatedData = await Books.populate(data, {
        path: "book",
        select: "title"
    })
        .then((data) => {
            res.status(200).json(data);
        })
        .catch((err) => {
            next(err);
        });
  
};

// Find the most read books for today
exports.mostReadBooks = async (req, res, next) => {
    const data = await Read.aggregate([
        {
            $group: {
                _id: "$book",
                count: { $sum: 1 }
            }
        },
        {
            $sort: { count: -1 }
        },
        {
            $limit: 5
        }
    ]);
    const populatedData = await Books.populate(data, {
        path: "_id",
        select: "title"
    })
        .then((data) => {
            res.status(200).json(data);
        })
        .catch((err) => {
            next(err);
        });
    
};