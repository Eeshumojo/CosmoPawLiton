const express = require('express');
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

const User = require("./routes/models/user.model.js");
const NGO = require("./routes/models/ngo.model.js");
const Report = require("./routes/models/report.model.js");
const Animal = require("./routes/models/animal.model.js");

//Require Atlas database URI from environment variables
const DBURI = process.env.DBURI;

//Connect to MongoDB client using mongoose
mongoose
  .connect(DBURI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(() => {
    console.log("Database Connected")
    User.init();
    NGO.init();
    Report.init();
    Animal.init();
  })
  .catch((err) => {
    debug.log(`System: NIL >> ${err.toString()}`);
  });

mongoose.Promise = global.Promise;

//Use body-parser to parse json body
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Allow CORS
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, Authorization, auth-token"
    );
    if (req.method === "OPTIONS") {
      res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
      return res.status(200).json({});
    }
    next();
  });

app.use(cors());


//This function will give a 404 response if an undefined API endpoint is fired
app.use((req, res, next) => {
    const error = new Error("Route not found");
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
      error: {
        message: error.message,
      },
    });
});

const PORT = process.env.PORT || 3000;

//Start the server
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
