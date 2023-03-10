const express = require("express");
// "NODE_ENV=development npm start" or "NODE_ENV=production npm start"
const config = require("config");
const cors = require("cors");
const Loggings = require("morgan");
const mongoose = require("mongoose");

console.log(config.name);

//Routes
const LoginRoute = require("./Routes/LoginRoute");
const AuthenticationMW = require("./Core/AuthenticationMw/AuthenticationMW");
const AdminstratorRoute = require("./Routes/AdminstratorRoute");
const EmployeeRoute = require("./Routes/EmployeeRoute");
const BooksRoute = require("./Routes/BooksRoute");
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
        console.log("DB connected");
        // Listening
        app.listen(port, () => {
            console.log(`Listening on port ${port}`);
        });
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

// Testing Books
app.use(BooksRoute);
//LoginMW
app.use(LoginRoute);

//AuthenticationMW
app.use(AuthenticationMW);

// Use Routes
app.use(AdminstratorRoute);
app.use(EmployeeRoute);

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
