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
  members: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "members",
    },
  ],
  employees: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "employees",
    },
  ],
  copiesInReading: {
    type: Number,
    required: [true, "Number Of Books In Reading"],
  },
});
mongoose.model("readingBooks", schema);
