const mongoose = require("mongoose");
// require("./../Model/BooksModel");
require("./../Model/ReadingBooksModel");
require("./../Model/ReadingBooksReportModel");
const ReadingBookSchema = mongoose.model("readingBooks");
const ReadingBookReportSchema = mongoose.model("readingBooksReport");
const BooksSchema = mongoose.model("books");

exports.gettingReadingBooks = (req, res, next) => {
  ReadingBookReportSchema.find({
    $or: [
      { $and: [{ year: req.body.year }, { month: req.body.month }] },
      { year: req.body.year },
      { month: req.body.month },
    ],
  })
    .then((data) => res.status(200).json({ data }))
    .catch((error) => next(error));
};

exports.giveBookForReading = async (req, res, next) => {
  const wantedBook = await BooksSchema.findOne(
    { title: req.params.title },
    { isAvailable: 1 }
  );
  if (wantedBook["isAvailable"] === true) {
    let date = new Date();
    if (req.decodedToken["role"] === "Member") {
      ReadingBookSchema.updateOne(
        { title: req.params.title },
        {
          $set: {
            date,
            book: wantedBook["_id"],
            members: req.decodedToken["_id"],
          },
          $inc: { copiesInReading: 1 },
        },
        { new: true }
      )
        .then((data) => {
          //Pushing The Reading Request Into the Report Database
          let date = new Date();
          ReadingBookReportSchema.findOneAndUpdate(
            { year: date.getFullYear, month: date.getMonth },
            {
              readBooks: wantedBook["_id"],
            },
            { upsert: true, new: true }
          )
            .then(() => {
              res.status(201).json({
                Message: "Getting Book For Reading Successfull ",
                data,
              });
            })
            .catch((error) => next(error));
        })
        .catch((error) => next(error));
    } else if (req.decodedToken["role"] === "Employee") {
      ReadingBookSchema.updateOne(
        { title: req.params.title },
        {
          $set: {
            date,
            book: wantedBook["_id"],
            employees: req.decodedToken["_id"],
          },
          $inc: { copiesInReading: 1 },
        },
        { new: true }
      )
        .then((data) => {
          //Pushing The Reading Request Into the Report Database
          let date = new Date();
          ReadingBookReportSchema.findOneAndUpdate(
            { year: date.getFullYear, month: date.getMonth },
            {
              readBooks: wantedBook["_id"],
            },
            { upsert: true, new: true }
          )
            .then(() => {
              res.status(201).json({
                Message: "Getting Book For Reading Successfull ",
                data,
              });
            })
            .catch((error) => next(error));
        })
        .catch((error) => next(error));
    }
  }
};

exports.returningReadBooks = (req, res, next) => {
  ReadingBookSchema.updateOne(
    { title: req.params.title },
    {
      $inc: { copiesInReading: -1 },
    }
  )
    .then((data) =>
      res.status(200).json({ Message: "Book Returned From Reading", data })
    )
    .catch((error) => next(error));
};

exports.checkingUnReturnedReadBooks = () => {
  ReadingBookSchema.find({ copiesInReading: { $gt: 0 } }, { book: 1 }).then(
    (data) => {
      if (data !== null) console.log("Unreturned Books Are" + unReturnedBooks);
      else console.log("All Reading Books 've been Returned");
    }
  );
};
