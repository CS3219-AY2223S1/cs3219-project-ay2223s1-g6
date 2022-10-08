// Import express
//let express = require('express');
import express from 'express'
// Import Body parser
//let bodyParser = require('body-parser');
import bodyParser from 'body-parser'
// Import Mongoose
//let mongoose = require('mongoose');
// Initialise the app
let app = express();
//require("dotenv").config();

// Configure bodyparser to handle post requests
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());


// Import routes
import router from "./question_routers/questions_api.js";
//let apiRoutes = require("./question_routers/questions_api.js");
// // Connect to Mongoose and set connection variable
// console.log(process.env.MONGODB_URI)
// mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/questionBank', { useNewUrlParser: true});
// var db = mongoose.connection;
//
// // Added check for DB connection
// if(!db)
//     console.log("Error connecting db")
// else
//     console.log("Db connected successfully")

//import {router} from './question_routers/questions_api';
// import { createUser } from './controllers/question-controller';

// Setup server port
var port = 4002 || process.env.PORT;

// Send message for default URL
app.get('/', (req, res) => res.send('Hello World with Express'));

//Use Api routes in the App
app.use('/questions', router);
// Launch app to listen to specified port
console.log(port)
app.listen(port, function () {
    console.log("Running RestHub on port " + port);
});