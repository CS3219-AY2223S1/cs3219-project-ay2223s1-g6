// Import express
import cors from 'cors';
// Import Body parser
//let bodyParser = require('body-parser');
import bodyParser from 'body-parser';
//let express = require('express');
import express from 'express';
// Import routes
import router from './question_routers/questions_api.js';
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
app.use(cors()); // config cors so that front-end can use
app.options('*', cors()); // TODO: what's this?

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

// Send message for default URL
app.get('/', (req, res) => res.send('Hello World with Express'));

//Use Api routes in the App
// <<<<<<< HEAD
app.use('/api/questions', router);
// =======
// app.use('/api/questions', apiRoutes);
// >>>>>>> 2ec9c2c58119b79a393d3c07a75875ab6680008f
// Launch app to listen to specified port

app.listen(process.env.PORT, function () {
    console.log("Running RestHub on port " + process.env.PORT);
});