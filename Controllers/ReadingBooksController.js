const mongoose = require("mongoose");
// require("./../Model/BooksModel");
require("./../Model/ReadingBooksModel");
require("./../Model/ReadingBooksReportModel");
const ReadingBookSchema = mongoose.model("readingBooks");
const ReadingBookReportSchema = mongoose.model("readingBooksReport");
const BooksSchema = mongoose.model("books");
const MemberSchema = mongoose.model("members");
const { totalAvailableCopies } = require("./../Controllers/BorrowsController");

exports.getReadingBookReport = (req, res, next) => {
  ReadingBookReportSchema.find({
    $or: [
      { $and: [{ year: req.body.year }, { month: req.body.month }] },
      { year: req.body.year },
      { month: req.body.month },
      {},
    ],
  })
    .populate("readBooks")
    .then((data) => res.status(200).json({ data }))
    .catch((error) => next(error));
};
// Here I Take _id Of Employee who is logined
//and taken email of the member who want to read
// searching for it and searching for the title of the book wanted
// inserting all the data by referancing there _id
exports.addReadingBook = async (req, res, next) => {
  try {
    const wantedBook = await BooksSchema.findOne({ _id: req.params["_id"] });
    const member = await MemberSchema.findOne({ _id: req.body["member"] });
    if (wantedBook && wantedBook["isAvailable"]) {
      let date = new Date();
      new ReadingBookSchema({
        date,
        book: req.params["_id"],
        member: member["_id"],
        employee: req.decodedToken["_id"],
        returned: false,
      })
        .save()
        .then((data) => {
          //Pushing The Reading Request Into the Report Database
          let date = new Date();
          ReadingBookReportSchema.findOneAndUpdate(
            { year: date.getFullYear(), month: date.getMonth() + 1 },
            {
              $push: { readBooks: data["_id"] },
            },
            { upsert: true, new: true }
          ).then(() => {
            if (totalAvailableCopies(req.params["_id"]) <= 0)
              wantedBook["isAvailable"] = false;
            res.status(201).json({
              Message: "Getting Book For Reading Successfull ",
              data,
            });
          });
        });
    } else throw new Error("The Book Is Not Available");
  } catch (error) {
    next(error);
  }
};

exports.returningReadBooks = async (req, res, next) => {
  try {
    let returnedBook = await BooksSchema.findOne(
      { book: req.params._id },
      { _id: 1 }
    );
    let returningMember = await MemberSchema.findOne(
      { email: req.body.email },
      { _id: 1 }
    );
    if (returnedBook && returningMember) {
      ReadingBookSchema.updateOne(
        { book: req.params["_id"], member: returningMember["_id"] },
        {
          $set: { returned: true },
        }
      ).then((data) => {
        if (totalAvailableCopies(req.params["_id"]) >= 0)
          returnedBook["isAvailable"] = true;
        if (data.modifiedCount !== 0)
          res.status(200).json({ Message: "Book Returned From Reading", data });
        else throw new Error("There is no record for returining this book");
      });
    } else throw new Error("There is no record for returining this book");
  } catch (error) {
    next(error);
  }
};

exports.checkingUnReturnedReadBooks = () => {
  ReadingBookSchema.find({ unReturned: true }, { book: 1 }).then((data) => {
    if (data !== null) console.log("Unreturned Books Are" + data);
    else console.log("All Reading Books 've been Returned");
  });
};
// getall reading book report
module.exports.getAllReadingBooks = async function getAllReadingBooks(
  req,
  res
) {
  try {
    const reports = await ReadingBookSchema.find()
      .populate("employee")
      .populate("member");
    return res.status(200).json({ success: true, data: reports });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      error: "Reading Report Data Can not be Returned",
    });
  }
};
