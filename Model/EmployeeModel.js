const mongoose = require('mongoose');


const employeeSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required:true,
        trim:true,
        minlength:3,
        maxlength:20
    },
    lastName: {
        type: String,
        required:true,
        trim:true,
        minlength:3,
        maxlength:20
    },
    email: {
        type: String,
        required:true,
    },
    password: {
        type: String,
        required:true,
    },
    birthDate: {
        type: Date,
        required:true,
    },
    hireDate: {
        type: Date,
        required:true,
    },
    image: String,
    salary: {
        type: Number,
        required:true,
    },
    settings: {
        type: String,
        default: "default"
    },
    

});

mongoose.model('employees', employeeSchema);