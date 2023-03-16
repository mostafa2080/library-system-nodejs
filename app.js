const express = require("express");
// "NODE_ENV=development npm start" or "NODE_ENV=production npm start"
const config = require("config");
const cors = require("cors");
const Loggings = require("morgan");
const mongoose = require("mongoose");
const checkDeadlines = require("./cron").checkDeadlines;

console.log(config.name);

//Routes
const LoginRoute = require("./Routes/LoginRoute");
const AuthenticationMW = require("./Core/AuthenticationMw/authenticationMw");
const AdministratorRoute = require("./Routes/AdministratorRoute");
const EmployeeRoute = require("./Routes/EmployeeRoute");
const BooksRoute = require("./Routes/BooksRoute");
const MembersRoute = require("./Routes/MembersRoute");

//Report Routes
const AdministratorReportRoute = require("./Routes/AdminstratorReportRoute");

//Port Connection
const port = config.port || 8080; //Used in Listening
const app = express();

// Strict Query Handiling
mongoose.set("strictQuery", true);
// Db Connection
mongoose
  .connect(config.db.uri)
  // .connect(
  //     `${config.db.driver}://${config.db.hostName}:${config.db.portNumber}/${config.db.dbName}`
  // )
  .then(() => {
    console.log(`DB connected - ${config.db.name}`);
    // Listening
    app.listen(port, () => {
      console.log(`Listening on port ${port}`);
    });
    // Check to see if members need to be banned or unbanned
    checkDeadlines();
  })
  .catch((error) => {
    console.log("Db Problem " + error);
  });

// CORS
app.use(cors());

// Loggings MiddleWare using Morgan
app.use(Loggings("dev"));

// Parsing
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//LoginMW
app.use(LoginRoute);

//AuthenticationMW
app.use(AuthenticationMW);

// Use Routes
app.use(BooksRoute);
app.use(MembersRoute);
app.use(EmployeeRoute);
app.use(AdministratorRoute);

//Using Report Routes
app.use(AdministratorReportRoute);

// Not Found MW
app.use((request, response) => {
  console.log("Not Found");
  response.status(404).json({
    message: "Not Found",
  });
});

// Error MW
app.use((error, request, response, next) => {
  response.status(500).json({ message: error + "" });
});
