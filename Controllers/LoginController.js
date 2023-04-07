const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
require("../Model/AdministratorModel");
const bcrypt = require("bcrypt");
const AdminSchema = mongoose.model("administrators");

module.exports = async (req, res, next) => {
  if (!req.body.email || !req.body.password)
    next(new Error("Email Or Password Are Wrong..."));
  else {
    let data = await AdminSchema.findOne(
      { email: req.body.email }
    );
    if (data !== null) {
        let data2 = data;
      if (req.body.email === "BasicAdmin@Library.Co") {
        bcrypt
          .compare(req.body.password, data["password"])
          .then((data) => {
            if (data) {
              let token = jwt.sign({ role: "BasicAdmin" }, "OSTrack", {
                expiresIn: "8h",
              });
              res.status(200).json({
                Message: "Authenticated",
                token,
              });
            } else throw new Error("Email Or Password Are Wrong");
          })
          .catch((error) => next(error));
      } else {
        bcrypt
          .compare(req.body.password, data["password"])
          .then((data) => {
            if (data) {
              let token = jwt.sign(
                {
                  role: "Admin",
                  email: data2["email"],
                },
                "OSTrack",
                {
                  expiresIn: "8h",
                }
              );

              res.status(200).json({
                Message: "Authenticated",
                data: data2,
                token,
              });
            } else throw new Error("Email Or Password Are Wrong");
          })
          .catch((error) => next(error));
      }
    } else next(new Error("Email Or Password Are Wrong"));
  }
};
