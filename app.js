/*
User Management App
CEN4010 Final Project - Reduced scope
Written by Shaan Khan
*/

// Import Express and create an instance of it. This will be our server.
const express = require('express');
const app = express();

// Morgan will log requests. This will help us figure out errors in code.
const morgan = require('morgan');
app.use(morgan('short'));

// Import MySQL library for making queries to User table in our MySQL database.
const mysql = require('mysql');

// The body-parser library will be used to parse what the user enters into our html forms.
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: false}));

// Static HTML files will be served from the public directory by Express
app.use(express.static('./public'));

// Specify root route. Use / for root. req = request, res = response.
app.get("/", (req, res) => {
  // Log that the root route is being touched.
  console.log("Responding to root route");

  // Here is the response to the client request to the root.
  res.send("You have reached the root.");
})

const pw = process.env.MYSQLCONNECTION_PASSWORD;

// GetConnection is a helper function that will connect to the clearDB database on Heroku
function getConnection() {
  return mysql.createConnection({
    host: 'us-cdbr-east-02.cleardb.com',        
    user: 'b9d4c3681f80a2',
    password: pw,
    database: 'heroku_8b62da28ef089e5'
  })
}

// On a local machine the application will listen to port 8087, but when deployed the port number will be
// set by process.env.PORT, an environmental variable provided by Heroku. 
app.listen((process.env.PORT || 8087), () => {
    console.log("Server is functional, and listening on port 8087.")
})

// Specify root route. Use / for root. req = request, res = response.
app.get("/", (req, res) => {
  // Log that the root route is being touched.
  console.log("Responding to root route");

  // Here is the response to the client request to the root.
  res.send("You have reached the root.");
})

// POST new user's information.
// Create a new user and insert his or her info to the user table.
app.post('/new_user_registration', (req, res) => {
  console.log("Registering new user.");

  // Use bodyparser to get variables passed in
  console.log("Email: " + req.body.createNewEmail);  
  console.log("Username: " + req.body.createNewUsername);
  console.log("Passcode: " + req.body.createNewPasscode);

  // Store the Strings input by user into variables
  var newEmailString = req.body.createNewEmail;
  var newUsernameString = req.body.createNewUsername;
  var newPasscodeString = req.body.createNewPasscode;

  // queryString will hold SQL command to enter tuple with new user's info into database.
  const queryString = "INSERT INTO user (email, username, passcode) VALUES (?, ?, ?)";

  // Now execute MySQL query to insert these values into table. 
  getConnection().query(queryString, [newEmailString, newUsernameString, newPasscodeString], (err, results, fields) => {
    if (err) {
      console.log("Failed to INSERT new user's registration info.");
      return
    }
  })
  console.log("Registration of a new user was successful.");
  return;
})