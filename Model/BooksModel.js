const mongoose = require("mongoose");

const booksSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Why no book title? 😭"],
    trim: true,
    minLength: [1, "Book title is too small 😒"],
    maxLength: [100, "Book title is too big 😣"],
  },
  author: {
    type: String,
    required: [true, "Why no author name? 😭"],
    trim: true,
    minLength: [1, "Author name is too small 😒"],
    maxLength: [100, "Author name is too big 😣"],
  },
  publisher: {
    type: String,
    required: [true, "Why no publisher name? 😭"],
    trim: true,
    minLength: [1, "Publisher name is too small 😒"],
    maxLength: [100, "Publisher name is too big 😣"],
  },
  dateAdded: {
    type: Date,
    required: false,
    default: Date.now,
  },
  datePublished: {
    type: Date,
    required: [true, "Enter publishing date 😠"],
  },
  category: {
    type: String,
    required: [true, "Why no category name? 😭"],
    trim: true,
    minLength: [1, "Category name is too small 😒"],
    maxLength: [100, "Category name is too big 😣"],
  },
  pagesCount: {
    type: Number,
    required: [true, "Why no pages count? 😭"],
    min: [1, "Pages count is too small 😒"],
    max: [1800, "Pages count is too high 😣"],
  },
  copiesCount: {
    type: Number,
    required: [true, "Why no copies count? 😭"],
    min: [1, "Copies count is too small 😒"],
    max: [100, "Copies count is too big 😣"],
  },
  isAvailable: {
    type: Boolean,
    required: [true, "Is book available or not? 🤓"],
  },
  shelfNo: {
    type: Number,
    required: [true, "What is the shelf number? 🤔"],
    min: [1, "Shelf number does not exist 😒"],
    max: [100, "Shelf number does not exist 😣"],
  },
});

mongoose.model("books", booksSchema);
