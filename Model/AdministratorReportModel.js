const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  administratorsNumber: {
    type: Number,
    required: [true, "Administrators Number iS Needed"],
  },
  existingAdministratorsNumber: {
    type: Number,
    required: [true, "Existing Administrators Number iS Needed"],
  },
  deletedAdministratorsNumber: {
    type: Number,
    required: [true, "Deleted Adminsitrators Number iS Needed"],
  },
  year: {
    type: Number,
    required: [true, "Current Year iS Needed"],
  },
  month: {
    type: Number,
    required: [true, "Current Month iS Needed"],
  },
});

mongoose.model("administratorsReport", schema);
