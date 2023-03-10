const mongoose = require("mongoose");
// require('./../Model/administratorModel');
const fs = require("fs");
const bcrypt = require("bcrypt");
const { body } = require("express-validator");

const saltRounds = 10;
const salt = bcrypt.genSaltSync(saltRounds);
const administratorsSchema = mongoose.model("administrators");

// Get all administrators
exports.getAllAdministrators = (req, res, next) => {
    administratorsSchema
        .find({})
        .then((data) => {
            res.status(200).json({ data });
        })
        .catch((err) => {
            next(err);
        });
};
// Add a Administrator
exports.addAdministrator = (req, res, next) => {
    new administratorsSchema({
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

//Update a Administrator
exports.updateAdministrator = async (req, res, next) => {
    let hashPass = req.body.password
        ? bcrypt.hashSync(req.body.password, salt)
        : req.body.password;

    let doc = await administratorsSchema.findOne(
        { firstName: req.body.firstName, lastName: req.body.lastName },
        { image: 1 }
    );
    let imagePath = doc["image"];
    administratorsSchema
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
                next(new Error("Administrator not found"));
            else {
                if (
                    req.body.image.toLowerCase().includes(".jpeg") ||
                    req.body.image.toLowerCase().includes(".jpg") ||
                    req.body.image.toLowerCase().includes(".png")
                )
                    fs.unlink(imagePath, (error) => next(error));

                res.status(200).json({ data });
            }
        })
        .catch((err) => next(err));
};

// Delete a Administrator
exports.deleteAdministrator = async (req, res, next) => {
    let doc = await administratorsSchema.findOne(
        { firstName: req.body.firstName, lastName: req.body.lastName },
        { image: 1 }
    );
    administratorsSchema
        .deleteOne({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
        })
        .then((data) => {
            if (data.deletedCount == 0)
                next(new Error("Administrator not found"));
            else {
                fs.unlink(doc["image"], (error) => next(error));
                res.status(200).json({ data });
            }
        })
        .catch((err) => next(err));
};
