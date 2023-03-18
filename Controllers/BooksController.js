const mongoose = require('mongoose');
require('../Model/BooksModel');
const Books = mongoose.model('books');

exports.getAllBooks = async (req, res, next) => {
  try {
    const books = await Books.find({});
    res.status(200).json({ books });
  } catch (err) {
    next(err);
  }
};

// This function gets a book by its ID from the database and returns it as a JSON object.
// If the book is not found, it throws an error with message "Book not found 💩".
// If there's an error in fetching the book, it calls the error handling middleware.
exports.getBook = async (req, res, next) => {
    try {
        const book = await Books.findById(req.params._id);
        if (!book) throw Error("Book not found 💩");
        else {
            res.status(200).json({ book });
        }
    } catch (err) {
        next(err);
    }
};
//add book to db
exports.addBook = async (req, res, next) => {
  try {
    const book = await new Books({
      title: req.body.title,
      author: req.body.author,
      publisher: req.body.publisher,
      dateAdded: req.body.dateAdded,
      datePublished: req.body.datePublished,
      category: req.body.category,
      pagesCount: req.body.pagesCount,
      copiesCount: req.body.copiesCount,
      isAvailable: req.body.isAvailable,
      shelfNo: req.body.shelfNo,
    }).save();

    res.status(200).json({ book });
  } catch (err) {
    next(err);
  }
};

//update a Book
exports.updateBook = async (req, res, next) => {
  try {
    const book = await Books.updateOne(
      { _id: req.params._id },
      {
        $set: {
          title: req.body.title,
          author: req.body.author,
          publisher: req.body.publisher,
          dateAdded: req.body.dateAdded,
          datePublished: req.body.datePublished,
          category: req.body.category,
          pagesCount: req.body.pagesCount,
          copiesCount: req.body.copiesCount,
          isAvailable: req.body.isAvailable,
          shelfNo: req.body.shelfNo,
        },
      }
    );

    res.status(200).json({ book });
  } catch (err) {
    next(err);
  }
};
//Delete A Book
exports.deleteBook = async (req, res, next) => {
    try {
        const book = await Books.deleteOne({ _id: req.params._id });
        if (book.deletedCount == 0) throw Error("Book not found 💩");
        else {
            res.status(200).json({ book });
        }
    } catch (err) {
        next(err);

    }
};

//Find Books That match Certain keyword
// $or operator is used to search for books that have a title, author, or publisher that matches the keyword.
exports.searchBooks = async (req, res, next) => {
  try {
    const searchResultbooks = await Books.find({
      $or: [
        { title: { $regex: req.params.keyword } },
        { author: { $regex: req.params.keyword } },
        { publisher: { $regex: req.params.keyword } },
      ],
    });
    if (searchResultbooks.length === 0) {
      res.status(404).json({ message: 'No books found' });
    } else {
      res.status(200).json({ searchResultbooks });
    }
  } catch (err) {
    next(err);
  }
};
