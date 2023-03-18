const mongoose = require("mongoose");
const schema = new mongoose.Schema({
  date: {
    type: Date,
    required: [true, "Date Of Reading Is Required"],
  },
  book: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "books",
  },
  member: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "members",
  },
  employee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "employees",
  },
  unReturned: {
    type: Boolean,
    required: [true, "Flag For unReturned Book"],
  },
});
mongoose.model("readingBooks", schema);
