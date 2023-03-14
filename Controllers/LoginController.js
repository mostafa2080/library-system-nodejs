const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
require("./../Model/AdminstratorModel");
const bcrypt = require('bcrypt');
const AdminSchema = mongoose.model("adminstrators");

module.exports = async (req, res, next) => {
    if( !req.body.email || !req.body.password )
        next(new Error("Email Or Password Are Wrong"));
    else
    {
        //let data = await AdminSchema.findOne({ email : req.body.email } , { email : 1, password : 1 });
        //if( data !== null)
        //{
            if( req.body.email === "BasicAdmin@Library.Co" )
            {
               /* bcrypt.compare(req.body.password, data["password"])
                .then(data => {
                    if(data)
                    {*/
                        let token = jwt.sign(
                            { role : "BasicAdmin" },
                            "OSTrack",
                            { expiresIn : "8h" }
                        )
                        res.status(200).json({ Message : "Authenticated", token })
                    /*}
                    else
                        throw new Error("Email Or Password Are Wrong");
                })
                .catch(error => next(error));*/
            }
            else
            {
                bcrypt.compare(req.body.password, data["password"])
                .then(data => {
                    if(data)
                    {
                        let token = jwt.sign(
                            { role : "Admin" },
                            "OSTrack",
                            { expiresIn : "8h" }
                        )
                        res.status(200).json({ Message : "Authenticated", token })
                    }
                    else
                        throw new Error("Email Or Password Are Wrong");
                })
                .catch(error => next(error));
            }
        //}
        //else
            //next(new Error("Email Or Password Are Wrong"));
            
    }
}