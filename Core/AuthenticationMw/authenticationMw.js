const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    let token = req.get("authorization").split(" ")[1];
    let decodedToken = jwt.verify(token, "OSTrack");
    req.decodedToken = decodedToken;

    next();
  } catch (error) {
    error.status = 401;
    error.message = "UnAuthenticated";
    next(error);
  }
};
