const express = require('express');
const cors = require('cors');
const Loggings = require('morgan');
const mongoose = require('mongoose');

//Routes
const AdminstratorRoute = require('./Routes/AdminstratorRoute');
//Port Connection
const port = process.env.PORT || 8080; //Used in Listening
const app = express();

// Strict Query Handiling
mongoose.set('strictQuery', true);
// Db Connection
mongoose
  .connect('mongodb://127.0.0.1:27017/librarySystem')
  .then(() => {
    console.log('DB connected');
    // Listening
    app.listen(port, () => {
      console.log(`Listening on port ${port}`);
    });
  })
  .catch((error) => {
    console.log('Db Problem ' + error);
  });

// CORS
app.use(cors());

// Loggings MiddleWare using Morgan
app.use(Loggings('dev'));

// Parsing
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Use Routes
app.use(AdminstratorRoute);

// Not Found MW
app.use((request, response) => {
  console.log('Not Found');
  response.status(404).json({
    message: 'Not Found',
  });
});

// Error MW
app.use((error, request, response, next) => {
  response.status(500).json({ message: error + '' });
});
