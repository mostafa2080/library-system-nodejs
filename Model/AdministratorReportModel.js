const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  administratorsNumber: {
    type: Number,
    required: [true, "Administrators Number iS Needed"],
  },
  TotalExistedAdministratorsNumber: {
    type: Number,
    required: [true, "Existing Administrators Number iS Needed"],
  },
  TotalDeletedAdministratorsNumber: {
    type: Number,
    required: [true, "Deleted Adminsitrators Number iS Needed"],
  },
  existingAdministratorsNumber: {
    type: Number,
    required: [true, "Existing Administrators Number iS Needed"],
  },
  deletedAdministratorsNumber: {
    type: Number,
    required: [true, "Deleted Adminsitrators Number iS Needed"],
  },
  reportMonth: {
    type: String,
    required: [true, "Current Month iS Needed"],
  },
});

mongoose.model("administratorsReport", schema);
