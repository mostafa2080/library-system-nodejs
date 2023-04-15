const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
require("../Model/AdministratorModel");
const bcrypt = require("bcrypt");
const AdminSchema = mongoose.model("administrators");

module.exports = async (req, res, next) => {
  if (!req.body.email || !req.body.password)
    next(new Error("Email Or Password Are Wrong"));
  else {
    try {
      let admin = await AdminSchema.findOne({ email: req.body.email });

      if (admin !== null) {
        let result = bcrypt.compare(req.body.password, admin["password"]);

        if (result) {
          let token = jwt.sign(
            { id: admin["_id"], role: admin["role"] },
            "OSTrack",
            {
              expiresIn: "8h",
            }
          );

          res.status(200).json({
            Message: "Authenticated",
            id: admin["_id"],
            data: admin,
            token,
          });
        } else throw new Error("Email Or Password Are Wrong");
      } else throw new Error("Email Or Password Are Wrong");
    } catch (error) {
      next(error);
    }
  }
};
