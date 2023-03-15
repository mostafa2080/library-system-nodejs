const mongoose = require("mongoose");
require("../Model/AdministratorReportModel");
const AdminReportSchema = mongoose.model("administratorsReport");

module.exports = (request, response, next) => {
  AdminReportSchema.find({})
    .then((data) => {
      response.status(200).json({ data });
    })
    .catch((error) => next(error));
};
