exports.basicAdmin = (req, res, next) => {
  if (req.decodedToken.role === "BasicAdmin") {
    next();
  } else {
    let err = new Error("UnAuthorized");
    err.status = 401;
    next(err);
  }
};

exports.adminOrAbove = (req, res, next) => {
  if (
    req.decodedToken.role === "Admin" ||
    req.decodedToken.role === "BasicAdmin"
  )
    next();
  else {
    let err = new Error("UnAuthorized");
    err.status = 401;
    next(err);
  }
};

exports.employeeOrAbove = (req, res, next) => {
  if (
    req.decodedToken.role === "Employee" ||
    req.decodedToken.role === "Admin" ||
    req.decodedToken.role === "BasicAdmin"
  )
    next();
  else {
    let err = new Error("UnAuthorized");
    err.status = 401;
    next(err);
  }
};

exports.memberOrAbove = (request, response, next) => {
  if (
    request.decodedToken.role == "Member" ||
    request.decodedToken.role == "Employee" ||
    request.decodedToken.role == "Admin" ||
    request.decodedToken.role == "BasicAdmin"
  ) {
    next();
  } else {
    let err = new Error("UnAuthorized");
    err.status = 401;
    next(err);
  }
};
