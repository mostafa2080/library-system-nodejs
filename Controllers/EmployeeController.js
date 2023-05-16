const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const {dirname} = require('path');

const saltRounds = 10;
const salt = bcrypt.genSaltSync(saltRounds);

require('../Model/EmployeeModel');
require('../Model/EmployeeReportsModel');
const Employees = mongoose.model('employees');
const EmployeeReports = mongoose.model('EmployeeReports');


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
exports.addEmployee =  (req, res,next) => {
    if(req.file != undefined){
        req.body.image = req.file.filename;

    }
    new Employees({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, salt),
        birthDate: req.body.birthDate,
        hireDate: req.body.hireDate || new Date(),
        image: req.body.image,
        salary: req.body.salary,
        settings: "default",
    })
    .save()
    .then(async(data) => {
        EmployeeReports.findOneAndUpdate({ month: new Date().getMonth() + 1, year: new Date().getFullYear() }, {
            $inc: {
                newEmp: 1,
            },
            $set: {
                numEmp: await Employees.countDocuments({}),
            }
        }, 
        { 
            upsert: true, new: true 
        })
        .then((data2) => {
            res.status(201).json({ data });
        })
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
    
    if(req.decodedToken.role === "Employee" && req.body._id === req.decodedToken._id){
        Employees.findOneAndUpdate({ _id: req.body._id }, {
            $set: {
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                password: req.body.password,
                birthDate: req.body.birthDate,
                image: req.body.image,
                settings: "manual",
            }
        },
        {new : true}
        )
        .then((data) => {

            if(req.file !== undefined){
                let root = dirname(require.main.filename);
                let path = root + "/images/Employee/" + data.image;
                fs.unlink(path, (err) => {
                if (err) {
                    console.log(err);
                }
                });
            }
            res.status(200).json({ data });
        })
        .catch((err) => {
            next(err);
        });
    }
    else if(req.decodedToken.role == "Admin" || req.decodedToken.role == "BasicAdmin"){
        Employees.findOneAndUpdate({ _id: req.body._id }, {
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
            if(req.file != undefined){
                let root = dirname(require.main.filename);
                let path = root + "/images/Employee/" + data.image;
                fs.unlink(path, (err) => {
                if (err) {
                    console.log(err);
                }
                });
            }
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
    Employees.findOneAndDelete({ _id: req.params._id })
    .then(async(data) => {
        let root = dirname(require.main.filename);
        let path = root + "/images/Employee/" + data.image;
        fs.unlink(path, (err) => {
            if (err) {
                console.log(err);
            }
        });
        EmployeeReports.findOneAndUpdate({ month: new Date().getMonth() + 1, year: new Date().getFullYear() }, {
            $inc: {
                numEmpLeave: 1,
            },
            $set: {
                numEmp: await Employees.countDocuments({}),
            }
        },
        {
            upsert: true, new: true
        })
        .then((data2) => {
            res.status(200).json({ data });
        })
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

                // TODO check if first login
                
                res.status(200).json({ msg: "Login Success",data:data ,token: token, settings: data.settings });
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





exports.searchByFirstName = (req, res, next) => {
    Employees.find({
        $or: [
            { firstName: { $regex: req.params.firstName, $options: "i" } }
        ]
    })
    .then((data) => {
        res.status(200).json({ data });
    })
    .catch((err) => {
        next(err);
    });
}
exports.searchByLastName = (req, res, next) => {
    Employees.find({
        $or: [
            { lastName: { $regex: req.params.lastName, $options: "i" } }
        ]
    })
    .then((data) => {
        res.status(200).json({ data });
    })
    .catch((err) => {
        next(err);
    });
}


