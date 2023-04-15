const mongoose = require("mongoose");

// Administrator Schema
const administratorSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [false, "Please Enter Administrator First Name "],
  },
  lastName: {
    type: String,
    required: [false, "Please Enter Administrator Last Name "],
  },
  email: {
    type: String,
    match: [
      /^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/,
      "Please Enter a valid Email",
    ],
    unique: [true, "Email Must Be Unique"],
    required: [true, "Please Enter Administrator Email"],
  },
  password: {
    type: String,
    minlength: 4,
    required: [true, "Please Enter Administrator Password"],
  },
  birthday: {
    type: Date,
    required: [false, "Please Enter Administrator Birth Date"],
  },
  hireDate: {
    type: Date,
    required: [true, "Please Enter Administrator Hire Date"],
  },
  image: String,
  salary: {
    type: Number,
    required: [true, "Please Enter Administrator Salary"],
  },
  role: {
    type: String,
    required: [false, "Please Enter Role Of Admin"],
  },
  setting: {
    type: String,
    required: [false, "Please Enter Role Of Admin"],
  },
});

// Mapping Schema to Model
mongoose.model("administrators", administratorSchema);
