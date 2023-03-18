const {body,param,query}=require("express-validator");

exports.memberPostValidator=[
    /*body("_id").notEmpty().withMessage("ID Field Required...!")
        .isMongoId().withMessage("ID must be a Object ID...!"),*/
    body("fullName").notEmpty().withMessage("FullName Field Required...!")
        .isString().withMessage("FullName must be string"),
    body("email").notEmpty().withMessage("Email Required...!")
        .isEmail().withMessage("Email must be in email format 'example@example.com'...!"),
    body("password").notEmpty().withMessage("Password Required...!")
        .isStrongPassword().withMessage("Password must be at least 8 chars, starts with capital char...!"),
    body("phoneNumber").optional().isMobilePhone().withMessage("Phone Number must be numbers only 'it must be a real mobile number'...!"),
    body("birthDate").optional().isDate().withMessage("BirthDate must be in date format...!"),
    body("address").optional().isObject().withMessage("address must be written in json format as an Object...!"),
    body("address.city").optional().isAlpha().withMessage("city must be string...!"),
    body("address.street").optional().isAlphanumeric().withMessage("street must be mixed...!"),
    body("address.building").optional().isAlphanumeric().withMessage("building must be mixed...!"),
    body("image").optional().isString()
];
/***************** Member Validation Array for Post Request ******************/

exports.memberPutValidator=[
    body("_id").notEmpty().withMessage("ID Field Required...!")
        .isMongoId().withMessage("ID must be a Object ID...!"),
    body("fullName").optional().notEmpty().withMessage("FullName Field Required...!")
        .isString().withMessage("FullName must be string"),
    body("email").optional().notEmpty().withMessage("Email Required...!")
        .isEmail().withMessage("Email must be in email format 'example@example.com'...!"),
    body("password").optional().notEmpty().withMessage("Password Required...!")
        .isStrongPassword().withMessage("Password must be at least 8 chars, starts with capital char...!"),
    body("phoneNumber").optional().isMobilePhone().withMessage("Phone Number must be numbers only 'it must be a real mobile number'...!"),
    body("birthDate").optional().isDate().withMessage("BirthDate must be in date format...!"),
    body("address").optional().isObject().withMessage("address must be written in json format as an Object...!"),
    body("address.city").optional().isAlpha().withMessage("city must be string...!"),
    body("address.street").optional().isAlphanumeric().withMessage("street must be mixed...!"),
    body("address.building").optional().isAlphanumeric().withMessage("building must be mixed...!"),
    body("image").optional().isString()
];
/***************** Member Validation Array for Put Request ******************/

exports.memberDeleteValidator=[
    param("_id").notEmpty().withMessage("ID parameter required...!")
        .isMongoId().withMessage("ID must be Object ID...!")
];
/***************** Member Validation Array for Delete Request ******************/

exports.getOneMember=[
    param("_id").notEmpty().withMessage("ID parameter required...!")
        .isMongoId().withMessage("ID must be Object ID...!")
];
/***************** Member Validation Array for Get One Member Request ******************/


exports.membersLoginValidator=[
    body("email").notEmpty().withMessage("Email Field Requirede...!")
    .isEmail().withMessage("Email must be in Email Format \"example@example.com\"...!"),
    body("password").notEmpty().withMessage("Password Field Requirede...!")
];
/***************** Member Validation Array for Login Request ******************/
