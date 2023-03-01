const express = require("express");
const morgan = require("morgan");
const config = require("config");
const debug = require("debug")("app:dev"); // Type DEBUG="app:dev npm start" to test in debug mode
const app = express();

const port = process.env.PORT || 3000;

debug(config.get("name"));

app.use(morgan("tiny"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use((err, req, res, next) => {
    res.status(500).send(new Error("Internal Server Error"));
});

app.listen(port, () => console.log(`Listening on port ${port} ...`));
