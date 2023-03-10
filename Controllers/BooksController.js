const mongoose = require("mongoose");
require("../Model/BooksModel");
const Books = mongoose.model("books");

exports.getAllBooks = async (req, res, next) => {
    try {
        const books = await Books.find({});
        res.status(200).json({ books });
    } catch (err) {
        next(err);
    }
};

exports.getBook = async (req, res, next) => {
    try {
        const book = await Books.findById(req.params._id);
        if (!book) next(new Error("Book not found 💩"));
        else {
            res.status(200).json({ book });
        }
    } catch (err) {
        next(err);
    }
};

exports.addBook = async (req, res, next) => {
    // if (
    //     !(
    //         req.decodedToken.role == "Admin" ||
    //         req.decodedToken.role == "BasicAdmin"
    //     )
    // ) {
    //     res.status(401).json({ message: "Unauthorized" });
    //     return;
    // }

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

exports.updateBook = async (req, res, next) => {
    if (
        !(
            req.decodedToken.role == "Admin" ||
            req.decodedToken.role == "BasicAdmin"
        )
    ) {
        res.status(401).json({ message: "Unauthorized" });
        return;
    }

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

exports.deleteBook = async (req, res, next) => {
    try {
        const book = await Books.deleteOne({ _id: req.params._id });
        if (book.deletedCount == 0) next(new Error("Book not found 💩"));
        else {
            res.status(200).json({ book });
        }
    } catch (err) {
        next(err);
    }
};

exports.searchBooks = async (req, res, next) => {
    // Search through one and only one field from title or author or publisher
    
    // if (req.query.title) {
    //     try {
    //         const books = await Books.find({});
    //         const searchResults = books.filter((book) => {
    //             return book.title
    //                 .toLowerCase()
    //                 .includes(req.query.title.toLowerCase());
    //         });
    //         res.status(200).json({ searchResults });
    //     } catch (err) {
    //         next(err);
    //     }
    // } else if (req.query.author) {
    //     try {
    //         const books = await Books.find({});
    //         const searchResults = books.filter((book) => {
    //             return book.author
    //                 .toLowerCase()
    //                 .includes(req.query.author.toLowerCase());
    //         });
    //         res.status(200).json({ searchResults });
    //     } catch (err) {
    //         next(err);
    //     }
    // } else if (req.query.publisher) {
    //     try {
    //         const books = await Books.find({});
    //         const searchResults = books.filter((book) => {
    //             return book.publisher
    //                 .toLowerCase()
    //                 .includes(req.query.publisher.toLowerCase());
    //         });
    //         res.status(200).json({ searchResults });
    //     } catch (err) {
    //         next(err);
    //     }
    // } else {
    //     res.status(400).json({ message: "Bad Request 🦥" });
    // }

    // Search through title, author, publisher with keyword
    try {
        const searchResultbooks = await Books.find({
            $or: [
                { title: { $regex: req.params.keyword } },
                { author: { $regex: req.params.keyword } },
                { publisher: { $regex: req.params.keyword } },
            ],
        });
        if (searchResultbooks.length === 0) {
            res.status(404).json({ message: "No books found" });
        } else {
            res.status(200).json({ searchResultbooks });
        }
    } catch (err) {
        next(err);
    }
};