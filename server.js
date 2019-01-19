// Require our dependencies
var express = require("express");
var mongoose = require("mongoose");
var logger = require("morgan");
var expressHandlebars = require("express-handlebars");
var bodyParser = require("body-parser");

// Set up out port to be either the host"s port, or 3000
var PORT = process.env.PORT || 3000;

//Set up own promise library due to error
mongoose.Promise = Promise;

// Instantiate our Express App
var app = express();


// Use morgan and body parser with our app
app.use(logger("dev"));
app.use(bodyParser.urlencoded({
  extended: false
}));

// Set up an Express Router
var router = express.Router();

// Require our routes file pass our router object
require("./config/routes")(router);

// Designate our public folder as a static directory
app.use(express.static("public"));

// Connect Handlebars to our Express app
app.engine("handlebars", expressHandlebars({
    defaultLayout: 'main'
}));
app.set('view engine', '.handlebars');

// Use bodyParser in out app
app.use(bodyParser.urlencoded({
    extended: false
}));

// Have every request go through our router middleware
app.use(router);




// if deployed use the deployed database. Otherwise use the local mongoHeadlines db
//var db = process.env.MONGODB_URI || "mongodb://localhost/mongoScraper";

var db = process.env.MONGODB_URI || "mongodb://heroku_f2q80qj3:6bk0fdi4222j8842thogj5rmus@ds111895.mlab.com:11895/heroku_f2q80qj3";

// Connect Mongoose to db
mongoose.connect(db, function (error) {
    // Log any errors connection with mongoose
    if (error) {
        console.log(error);
    }
    // or log a success message
    else {
        console.log("mongoose connection is successfull");
    }
});

// Listen on the port
app.listen(PORT, function () {
    console.log("Listening on port:" + PORT);
});