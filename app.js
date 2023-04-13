const express = require("express");
// "NODE_ENV=development npm start" or "NODE_ENV=production npm start"
const config = require("config");
const cors = require("cors");
const Loggings = require("morgan");
const mongoose = require("mongoose");
const banAndUnbanMembers = require("./cron").banAndUnbanMembers;

console.log(config.name);

//Routes
const LoginRoute = require("./Routes/LoginRoute");
const AuthenticationMW = require("./Core/AuthenticationMw/authenticationMw");
const AdministratorRoute = require("./Routes/AdministratorRoute");
const EmployeeRoute = require("./Routes/EmployeeRoute");
const BooksRoute = require("./Routes/BooksRoute");
const BorrowsRoute = require("./Routes/BorrowsRoute");
const MembersRoute = require("./Routes/MembersRoute");
const ReadingBookRoute = require("./Routes/ReadingBooksRoute");
const GeneralReportRoute = require("./Routes/GeneralReportRoute");

//Report Routes
const AdministratorReportRoute = require("./Routes/AdminstratorReportRoute");
const BooksReports = require("./Routes/BooksReportRoute");
const {join} = require("path");

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
    // Ban and unban members
    banAndUnbanMembers();
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
app.use('/images', express.static(join(__dirname, 'images')))
//LoginMW
app.use(LoginRoute);

//AuthenticationMW
app.use(AuthenticationMW);

// Use Routes
app.use(BooksRoute);
app.use(BorrowsRoute);
app.use(MembersRoute);
app.use(EmployeeRoute);
app.use(AdministratorRoute);
app.use(BooksReports);
app.use(ReadingBookRoute);
app.use(GeneralReportRoute);


//Using Report Routes
app.use(AdministratorReportRoute);

// Not Found MW
app.use((request, response) => {
  console.log("Not Found");
  response.status(404).json({
    message: "Page Not Found",
  });
});

// Error MW
app.use((error, request, response, next) => {
    // reponse with status code and message
    response.status(error.status || 500).json({
        message: error.message
    }
    );

});
