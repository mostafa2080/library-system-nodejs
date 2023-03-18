const mongoose = require("mongoose");
const schema = new mongoose.Schema({
  year: {
    type: Number,
    required: [true, "Year Of Report Is Needed"],
  },
  month: {
    type: Number,
    required: [true, "Month Of Report Is Needed"],
  },
  readBooks: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "readingBooks",
    },
  ],
});
mongoose.model("readingBooksReport", schema);
