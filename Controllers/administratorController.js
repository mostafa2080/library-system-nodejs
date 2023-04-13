const mongoose = require("mongoose");
require("../Model/AdministratorModel");
require("../Model/AdministratorReportModel");
const fs = require("fs");
const bcrypt = require("bcrypt");

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
    req.params.email === req.decodedToken.email
  ) {
    AdministratorsSchema.find({ _id: req.params.id })
      .then((data) => {
        if (data.length !== 0) res.status(200).json({ data });
        else throw new Error("Administrator Is Not Found");
      })
      .catch((error) => next(error));
  } else if (req.decodedToken.role === "BasicAdmin") {
    AdministratorsSchema.find({ _id: req.params.id })
      .then((data) => {
        if (data.length !== 0) res.status(200).json({ data });
        else throw new Error("Administrator Is Not Found");
      })
      .catch((error) => next(error));
  } else next(new Error("Can't Get Data About Any Other Admins Except Yours"));
};

// Add a Administrator
exports.addAdministrator = (req, res, next) => {
  let date = new Date();
  new AdministratorsSchema({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, salt),
    hireDate: req.body.hireDate,
    birthday: req.body.birthday,
    salary: req.body.salary,
    image: req.body.image,
    setting: "default",
  })
    .save()
    .then((data) => {
      let currentMonth = date.getMonth();
      let currentYear = date.getFullYear();
      AdministratorReportSchema.updateOne(
        { month: currentMonth, year: currentYear },
        {
          $inc: {
            administratorsNumber: 1,
            TotalExistedAdministratorsNumber: 1,
            existingAdministratorsNumber: 1,
          },
        },
        { upsert: true, new: true }
      )
        .then(() => res.status(201).json({ data }))
        .catch((error) => next(error));
    })
    .catch((error) => next(error));
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
      { _id: req.params.id },
      {
        $set: {
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          birthday: req.body.birthday,
          image: req.body.image,
        },
      }
    )
      .then((data) => {
        if (data === null) next(new Error("Administrator not found"));
        else {
          if (data["image"] != undefined)
            fs.unlink(data["image"], (error) => {
              if (error) console.log(error);
            });
          res.status(200).json({ data });
        }
      })
      .catch((err) => next(err));
  } else if (req.decodedToken.role === "BasicAdmin") {
    AdministratorsSchema.findOneAndUpdate(
      { _id: req.params.id },
      {
        $set: {
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          email: req.body.email,
          birthday: req.body.birthday,
          hireDate: req.body.hireDate,
          image: req.body.image,
          salary: req.body.salary,
        },
      }
    )
      .then((data) => {
        if (data === null) next(new Error("Administrator not found"));
        else {
          if (data["image"] !== undefined && req.body.image !== undefined)
            fs.unlink(data["image"], (error) => {
              if (error) console.log(error);
            });
          res.status(200).json({ data });
        }
      })
      .catch((error) => next(error));
  }
};

// Delete a Administrator
exports.deleteAdministrator = (req, res, next) => {
  AdministratorsSchema.findOneAndDelete({
    _id: req.params.id,
  })
    .then((data) => {
      if (data === null) throw new Error("Administrator not found");
      else {
        if (data["image"] !== undefined)
          fs.unlink(data["image"], (error) => {
            if (error) console.log(error);
          });

        let currentMonth = new Date().getMonth();
        let currentYear = new Date().getFullYear();

        AdministratorReportSchema.updateOne(
          { month: currentMonth, year: currentYear },
          {
            $inc: {
              existingAdministratorsNumber: -1,
              deletedAdministratorsNumber: 1,
            },
          },
          { upsert: true, new: true }
        )
          .then(() => res.status(201).json({ data }))
          .catch((error) => next(error));
      }
    })
    .catch((error) => next(error));
};
/**The third argument is an options object specifying that the upsert flag should be set to true, meaning that if a document with the specified month and year does not exist, MongoDB should create a new one, and that the new flag should also be set to true, meaning that MongoDB should return the updated document */
