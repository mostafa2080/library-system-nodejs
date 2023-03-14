const mongoose = require('mongoose');

const employeeReportsSchema = new mongoose.Schema({
    month: {
        type: Number,
        required: true
    },
    year: {
        type: Number,
        required: true
    },
    newEmp: {
        type: Number,
        required: false
    },
    numEmp: {
        type: Number,
        required: false
    },
    numEmpLeave: {
        type: Number,
        required: false
    },

})

const EmployeeReports = mongoose.model('EmployeeReports', employeeReportsSchema);