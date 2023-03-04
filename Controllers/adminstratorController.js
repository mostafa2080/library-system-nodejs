const mongoose = require('mongoose');
// require('./../Model/adminstratorModel');
const fs = require("fs");
const bcrypt = require('bcrypt');
const { body } = require('express-validator');

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
exports.updateAdminstrator = async (req, res, next) => {
  let hashPass = req.body.password
    ? bcrypt.hashSync(req.body.password, salt)
    : req.body.password;

  let doc = await adminstratorsSchema.findOne({ firstName: req.body.firstName , lastName : req.body.lastName },{ image : 1});
  let imagePath = doc["image"];
  adminstratorsSchema
    .updateOne(
      { firstName: req.body.firstName, lastName: req.body.lastName },
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
      if (data.matchedCount == 0) 
        next(new Error('Adminstrator not found'));
      else 
      {
        if(req.body.image.toLowerCase().includes(".jpeg") 
        || req.body.image.toLowerCase().includes(".jpg") 
        || req.body.image.toLowerCase().includes(".png"))
          fs.unlink(imagePath,error => next(error));

        res.status(200).json({ data });
      }
    })
    .catch((err) => next(err));
};

// Delete a Adminstrator
exports.deleteAdminstrator = async (req, res, next) => {
  let doc = await adminstratorsSchema.findOne({ firstName: req.body.firstName , lastName : req.body.lastName },{ image : 1});
  adminstratorsSchema
    .deleteOne({ firstName: req.body.firstName , lastName : req.body.lastName })
    .then((data) => {
      if (data.deletedCount == 0) 
        next(new Error('Adminstrator not found'));
      else
      {
        fs.unlink(doc["image"],error => next(error));
        res.status(200).json({ data });
      }
    })
    .catch((err) => next(err));
};
