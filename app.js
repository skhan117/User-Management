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

// GetConnection is a helper function that will connect to MySQL database
function getConnection() {
  return mysql.createConnection({
    host: 'localhost',        // Make connection to Heroku DB later. Local DB is fine for now. 
    user: 'root',
    password: '',
    database: 'UserInfo'
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

// Specify a test route. 
app.get("/test", (req, res) => {
  // Log that the test route is being touched.
  console.log("Responding to test route");

  // Here is the response to the client request to the root.
  res.send("You have reached the test root.");
})

