const mongoose = require("mongoose");
const schema = new mongoose.Schema({
  date: {
    type: date,
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
});
mongoose.model("readingBooks", schema);
