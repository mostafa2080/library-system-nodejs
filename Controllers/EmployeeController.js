const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const saltRounds = 10;
const salt = bcrypt.genSaltSync(saltRounds);

require('../Model/EmployeeModel');
const Employees = mongoose.model('employees');


// Get all Employees
exports.getAllEmployees = (req, res, next) => {
    Employees.find({})
    .then((data) => {
        res.status(200).json({ data });
    })
    .catch((err) => {
        next(err);
    });
}

// Get an Employee
exports.getEmployee = (req, res, next) => {
    if(req.decodedToken.role == "Employee" && req.params._id == req.decodedToken._id){
        Employees.findById(req.params._id)
        .then((data) => {
            res.status(200).json({ data });
        })
        .catch((err) => {
            next(err);
        });
    }
    else if(req.decodedToken.role == "Admin" || req.decodedToken.role == "BasicAdmin"){
        Employees.findById(req.params._id)
        .then((data) => {
            res.status(200).json({ data });
        })
        .catch((err) => {
            next(err);
        });
    }
    else{
        res.status(401).json({ Message : "Unauthorized" });
    }
}


// Add an Employee
exports.addEmployee = (req, res,next) => {
    new Employees({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, salt),
        birthDate: req.body.birthDate,
        hireDate: req.body.hireDate,
        image: req.file.filename,
        salary: req.body.salary,
    })
    .save()
    .then((data) => {
        res.status(201).json({ data });
    })
    .catch((err) => next(err));
}

//Update an Employee
exports.updateEmployee = (req, res, next) => {
    if(req.body.password != undefined){
        req.body.password = bcrypt.hashSync(req.body.password, salt);
    }
    if(req.file != undefined){
        req.body.image = req.file.filename;
    }
    if(req.decodedToken.role == "Employee" && req.body._id == req.decodedToken._id){
        Employees.updateOne({ _id: req.body._id }, {
            $set: {
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                email: req.body.email,
                password: req.body.password,
                birthDate: req.body.birthDate,
                hireDate: req.body.hireDate,
                image: req.body.image,
                salary: req.body.salary,
            }
        })
        .then((data) => {
            res.status(200).json({ data });
        })
        .catch((err) => {
            next(err);
        });
    }
    else if(req.decodedToken.role == "Admin" || req.decodedToken.role == "BasicAdmin"){
        Employees.updateOne({ _id: req.body._id }, {
            $set: {
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                email: req.body.email,
                password: req.body.password,
                birthDate: req.body.birthDate,
                hireDate: req.body.hireDate,
                image: req.body.image,
                salary: req.body.salary,
            }
        })
        .then((data) => {
            res.status(200).json({ data });
        })
        .catch((err) => {
            next(err);
        });
    }
    else{
        res.status(401).json({ Message : "Unauthorized" });
    }
}


// Delete an Employee
exports.deleteEmployee = (req, res, next) => {
    Employees.deleteOne({ _id: req.params._id })
    .then((data) => {
        res.status(200).json({ data });
    })
    .catch((err) => {
        next(err);
    });
}


// Login an Employee
exports.loginEmployee = (req, res, next) => {
    Employees.findOne({ email: req.body.email })
    .then((data) => {
        if (data) {
            if (bcrypt.compareSync(req.body.password, data.password)) {
                const token = jwt.sign({
                    _id: data._id,
                    email: data.email,
                    role: "Employee"
                },"OSTrack", { expiresIn: "1h" });

                res.status(200).json({ msg: "Login Success", token: token });
            }
            else {
                res.status(401).json({ Message: "Wrong Password" });
            }
        }
        else {
            res.status(401).json({ Message: "Employee Not Fount" });
        }
    })
    .catch((err) => {
        next(err);
    });
}