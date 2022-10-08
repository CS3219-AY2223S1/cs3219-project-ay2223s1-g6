// Import express
let express = require('express');
// Import Body parser
let bodyParser = require('body-parser');
// Import Mongoose
let mongoose = require('mongoose');
// Initialise the app
let app = express();
require("dotenv").config();

// Configure bodyparser to handle post requests
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());


// Import routes
let apiRoutes = require("./question_routers/questions_api");

// Connect to Mongoose and set connection variable
console.log(process.env.MONGODB_URI)
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/questionBank', { useNewUrlParser: true});
var db = mongoose.connection;

// Added check for DB connection
if(!db)
    console.log("Error connecting db")
else
    console.log("Db connected successfully")

// Setup server port
const port = process.env.PORT ||8002;

// Send message for default URL
app.get('/', (req, res) => res.send('Hello World with Express'));

//Use Api routes in the App
app.use('/api/questions', apiRoutes);
// Launch app to listen to specified port
console.log(port)
app.listen(port, function () {
    console.log("Running RestHub on port " + port);
});