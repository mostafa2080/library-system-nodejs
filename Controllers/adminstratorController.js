const mongoose = require('mongoose');
require('./../Model/adminstratorModel');
const bcrypt = require('bcrypt');

const saltRounds = 10;
const salt = bcrypt.genSaltSync(saltRounds);
const adminstratorsSchema = mongoose.model('adminstrators');

// Get all adminstrators
exports.getAllAdminstrators = (req, res, next) => {
  adminstratorsSchema
    .find({})
    .then((data) => {
      res.status(200).json({ data });
    })
    .catch((err) => {
      next(err);
    });
};
// Add a Adminstrator
exports.addAdminstrator = (req, res, next) => {
  new adminstratorsSchema({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, salt),
    birthDate: req.body.birthDate,
    hireDate: req.body.hireDate,
    image: req.body.image,
    salary: req.body.salary,
  })
    .save()
    .then((data) => {
      res.status(201).json({ data });
    })
    .catch((err) => next(err));
};

//Update a Adminstrator
exports.updateAdminstrator = (req, res, next) => {
  let hashPass = req.body.password
    ? bcrypt.hashSync(req.body.password, salt)
    : req.body.password;
  adminstratorsSchema
    .updateOne(
      {
        firstName: req.body.firstName,
      },
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
      if (data.matchedCount == 0) {
        next(new Error('Adminstrator not found'));
      } else res.status(200).json({ data });
    })
    .catch((err) => next(err));
};

// Delete a Adminstrator
exports.deleteAdminstrator = (req, res, next) => {
  adminstratorsSchema
    .deleteOne({ firstName: req.body.firstName })
    .then((data) => {
      if (data.deletedCount == 0) {
        next(new Error('Adminstrator not found'));
      } else res.status(200).json({ data });
    })
    .catch((err) => next(err));
};
