const mongoose = require('mongoose');

// Adminstrator Schema
const adminstratorSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'Please Enter Adminstrator First Name '],
  },
  lastName: {
    type: String,
    required: [true, 'Please Enter Adminstrator Last Name '],
  },
  email: {
    type: String,
    match: [
      /^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/,
      'Please Enter a valid Email',
    ],
    required: [true, 'Please Enter Adminstrator Email'],
  },
  password: {
    type: String,
    minlength: 4,
    required: [true, 'Please Enter Adminstrator Password'],
  },
  birthDate: {
    type: Date,
    required: [true, 'Please Enter Adminstrator Birth Date'],
  },
  hireDate: {
    type: Date,
    required: [true, 'Please Enter Adminstrator Hire Date'],
  },
  image: String,
  salary: {
    type: Number,
    required: [true, 'Please Enter Adminstrator Salary'],
  },
});

// Mapping Schema to Model
mongoose.model('adminstrators', adminstratorSchema);
