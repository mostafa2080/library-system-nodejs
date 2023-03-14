const express = require('express');
const {uploadImg, setImage} = require('./../Utilities/ImageUtility');

const Controller = require('./../Controllers/EmployeeController');
const validator = require('./../Core/ValidationMW/EmployeeValidation');
const auth = require('./../Core/AuthenticationMw/Authorization');
const Router = express.Router();




Router.route('/employee')
    .get(auth.adminOrAbove, Controller.getAllEmployees)
    .post(auth.adminOrAbove,
        uploadImg('Employee').single('image'),
        setImage
        ,validator.addValidator, Controller.addEmployee)
    .put(auth.employeeOrAbove,
        uploadImg('Employee').single('image'),
        setImage
        ,validator.editValidator, Controller.updateEmployee);

        

Router.route('/employee/reports')
    .get(auth.adminOrAbove, Controller.getReports)



Router.route('/employee/:_id')
    .get(auth.employeeOrAbove,validator.getValidator, Controller.getEmployee)
    .delete(auth.adminOrAbove, validator.deleteValidator, Controller.deleteEmployee);



module.exports = Router;
