const mongoose = require("mongoose");

const borrowsSchema = mongoose.Schema({
    bookID: {
        type: String,
        trim: true,
        required: [true, "Enter a valid book ID"],
    },
    memberID: {
        type: String,
        trim: true,
        required: [true, "Enter a valid book ID"],
    },
    employeeID: {
        type: String,
        trim: true,
        required: [true, "Enter a valid book ID"],
    },
    borrowDate: {
        type: Date,
        required: [true, "Enter a valid borrow date"],
        default: Date.now,
    },
    returnDate: {
        type: Date,
        default: null,
        required: false,
    },
    deadlineDate: {
        type: Date,
        required: [true, "Enter deadline date"],
    },
});

mongoose.model("borrows", borrowsSchema);


