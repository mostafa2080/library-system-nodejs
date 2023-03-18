const mongoose = require("mongoose");
// require("./../Model/BooksModel");
require("./../Model/ReadingBooksModel");
require("./../Model/ReadingBooksReportModel");
const ReadingBookSchema = mongoose.model("readingBooks");
const ReadingBookReportSchema = mongoose.model("readingBooksReport");
const BooksSchema = mongoose.model("books");
const MemberSchema = mongoose.model("members");

exports.getReadingBookReport = (req, res, next) => {
  ReadingBookReportSchema.find({
    $or: [
      { $and: [{ year: req.body.year }, { month: req.body.month }] },
      { year: req.body.year },
      { month: req.body.month },
    ],
  })
    // .populate({
    //   path: "readBooks",
    //   populate: { path: "employee", path: "member" },
    // })
    .then((data) => res.status(200).json({ data }))
    .catch((error) => next(error));
};
// Here I Take _id Of Employee who is logined
//and taken email of the member who want to read
// searching for it and searching for the title of the book wanted
// inserting all the data by referancing there _id
exports.addReadingBook = async (req, res, next) => {
  try {
    const wantedBook = await BooksSchema.findOne(
      { title: req.params.title },
      { isAvailable: 1 }
    );
    const member = await MemberSchema.findOne({ email: req.body.email });
    console.log(member["_id"]);
    if (wantedBook !== null && wantedBook["isAvailable"] === true) {
      let date = new Date();
      new ReadingBookSchema({
        date,
        book: wantedBook["_id"],
        member: member["_id"],
        employee: req.decodedToken["_id"],
        unReturned: true,
      })
        .save()
        .then((data) => {
          //Pushing The Reading Request Into the Report Database
          let date = new Date();
          ReadingBookReportSchema.findOneAndUpdate(
            { year: date.getFullYear(), month: date.getMonth() },
            {
              $push: { readBooks: wantedBook["_id"] },
            },
            { upsert: true, new: true }
          ).then(() => {
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

exports.returningReadBooks = (req, res, next) => {
  try {
    let returnedBook = BooksSchema.findOne(
      { title: req.params.title },
      { _id: 1 }
    );
    let returningMember = MemberSchema.findOne(
      { email: req.body.email },
      { _id: 1 }
    );
    if (returnedBook !== null && returningMember !== null) {
      ReadingBookSchema.updateOne(
        { book: returnedBook["_id"], employee: returningMember["_id"] },
        {
          $set: { unReturned: true },
        }
      ).then((data) =>
        res.status(200).json({ Message: "Book Returned From Reading", data })
      );
    }
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
