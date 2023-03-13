const mongoose = require("mongoose");
require("../Model/AdministratorModel");
require("../Model/AdministratorReportModel");
const fs = require("fs");
const bcrypt = require("bcrypt");
const { body } = require("express-validator");

const saltRounds = 10;
const salt = bcrypt.genSaltSync(saltRounds);
const AdministratorsSchema = mongoose.model("administrators");
const AdministratorReportSchema = mongoose.model("administratorsReport");

// Get all administrators
exports.getAllAdministrators = (req, res, next) => {
  AdministratorsSchema.find({})
    .then((data) => {
      res.status(200).json({ data });
    })
    .catch((error) => next(error));
};

//Get One Specific Admin
exports.getAdministrator = (req, res, next) => {
  if (
    req.decodedToken.role === "Admin" &&
    req.body.email === req.decodedToken.email
  ) {
    AdministratorsSchema.find({ email: req.decodedToken.email })
      .then((data) => {
        res.status(200).json({ data });
      })
      .catch((error) => next(error));
  } else if (req.decodedToken.role === "BasicAdmin") {
    AdministratorsSchema.find({ email: req.body.email })
      .then((data) => {
        res.status(200).json({ data });
      })
      .catch((error) => next(error));
  } else next(new Error("Can't Get Data About Any Other Admins Except Yours"));
};

// Add a Administrator
exports.addAdministrator = (req, res, next) => {
  let date = new Date().toJSON();
  new AdministratorsSchema({
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, salt),
    hireDate: date,
    salary: req.body.salary,
  })
    .save()
    .then(async (data) => {
      let currentMonth = new Date().getMonth();
      AdministratorReportSchema.updateOne(
        { Date: currentMonth },
        {
          administratorsNumber: { $inc: 1 },
          TotalExistedAdministratorsNumber: { $inc: 1 },
          existingAdministratorsNumber: { $inc: 1 },
        },
        { upsert: true }
      )
        .then(() => res.status(201).json({ data }))
        .catch((error) => next(error));
    })
    .catch((err) => next(err));
};

//Update a Administrator
exports.updateAdministrator = async (req, res, next) => {
  let hashPass = req.body.password
    ? bcrypt.hashSync(req.body.password, salt)
    : req.body.password;
  if (
    req.decodedToken.role === "Admin" &&
    req.body.email === req.decodedToken.email
  ) {
    AdministratorsSchema.findOneAndUpdate(
      { email: req.body.email },
      {
        $set: {
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          password: hashPass,
          birthDate: req.body.birthDate,
          image: req.body.image,
        },
      }
    )
      .then((data) => {
        if (data === null) next(new Error("Administrator not found"));
        else {
          if (data["image"] != null)
            fs.unlink(data["image"], (error) => next(error));
          res.status(200).json({ data });
        }
      })
      .catch((err) => next(err));
  } else if (req.decodedToken.role === "BasicAdmin") {
    AdministratorsSchema.findOneAndUpdate(
      { email: req.body.email },
      {
        $set: {
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          email: req.body.email,
          password: hashPass,
          birthDate: req.body.birthDate,
          hireDate: req.body.hireDate,
          image: req.body.image,
          salary: req.body.salary,
        },
      }
    )
      .then((data) => {
        if (data === null) next(new Error("Administrator not found"));
        else {
          if (data["image"] != null)
            fs.unlink(data["image"], (error) => next(error));
          res.status(200).json({ data });
        }
      })
      .catch((err) => next(err));
  }
};

// Delete a Administrator
exports.deleteAdministrator = async (req, res, next) => {
  AdministratorsSchema.findOneAndDelete({
    email: req.body.email,
  })
    .then((data) => {
      if (data === null) next(new Error("Administrator not found"));
      else {
        if (data["image"] !== null)
          fs.unlink(data["image"], (error) => next(error));

        let currentMonth = new Date().getMonth();
        AdministratorReportSchema.updateOne(
          { Date: currentMonth },
          {
            TotalExistedAdministratorsNumber: { $inc: -1 },
            existingAdministratorsNumber: { $inc: -1 },
            deletedAdministratorsNumber: { $inc: 1 },
            TotalDeletedAdministratorsNumber: { $inc: 1 },
          },
          { upsert: true }
        )
          .then(() => res.status(201).json({ data }))
          .catch((error) => next(error));
      }
    })
    .catch((err) => next(err));
};
