const mongoose = require("mongoose");

const borrowsSchema = mongoose.Schema({
    book: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'books',
        trim: true,
        required: [true, "Enter a valid book ID"],
    },
    member: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'members',
        trim: true,
        required: [true, "Enter a valid book ID"],
    },
    employee: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'employees',
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


