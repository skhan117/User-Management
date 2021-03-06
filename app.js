/*
User Management App
CEN4010
Written by Shaan Khan
*/

// The Express library will provide our server.
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

// Declare some global variables.
var thisEmail, thisUsername, thisPasscode, thisName, thisAddress, thisNickname, thisPhonenumber;

// Specify root route. Use / for root. req = request, res = response.
app.get("/", (req, res) => {
  // Log that the root route is being touched.
  console.log("Responding to root route");

  // Here is the response to the client request to the root.
  res.send("You have reached the root.");
})


// GetConnection is a helper function that will connect to the clearDB database on Heroku.
// The login information is retreived from the Heroku environment's config variables. 
function getConnection() {
  return mysql.createConnection({
    host: process.env.MYSQLCONNECTION_HOST,        
    user: process.env.MYSQLCONNECTION_USER,
    password: process.env.MYSQLCONNECTION_PASSWORD,
    database: process.env.MYSQLCONNECTION_DATABASE
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
  thisEmail = newEmailString;
  var newUsernameString = req.body.createNewUsername;
  thisUsername = newUsernameString;
  var newPasscodeString = req.body.createNewPasscode;
  thisPasscode = newPasscodeString;

  // queryString will hold SQL command to enter tuple with new user's info into database.
  const queryString = "INSERT INTO user (email, username, passcode) VALUES (?, ?, ?)";

  // Now execute MySQL query to insert these values into table. 
  getConnection().query(queryString, [newEmailString, newUsernameString, newPasscodeString], (err, results, fields) => {
    if (err) {
      console.log("Failed to INSERT new user's registration info.");
      return
    }
  })

  // After the new user has been registered into the system, he is redirected to the update-registration page
  console.log("Registration of a new user was successful.");
  res.redirect('/update-registration.html');
  return;
})

// POST method for updating a user's information.
// The user will be able to update all their info, except for
// their email address, since it serves as the primary key in the table.
app.post('/user_update', (req, res) => {
  console.log("Updating User info");

  // Use bodyparser to get variables passed in
  console.log("Username: " + req.body.updateUsername);
  console.log("Passcode: " + req.body.updatePasscode);
  console.log("Name: " + req.body.updateName);  
  console.log("Address: " + req.body.updateAddress);  
  console.log("Nickname: " + req.body.updateNickname);  
  console.log("PhoneNumber: " + req.body.updatePhonenumber);  

  // Store the Strings input by user into variables
  var updateUsernameString = req.body.updateUsername;
  var updatePasscodeString = req.body.updatePasscode;
  var updateNameString = req.body.updateName;
  var updateAddressString = req.body.updateAddress;
  var updateNicknameString = req.body.updateNickname;
  var updatePhonenumberString = req.body.updatePhoneNumber;

  // Store email of record to update
  var emailString = thisEmail;  

  // queryString will hold SQL command
  const queryString = "UPDATE user SET username = ?, passcode = ?, name = ?, address = ?, nickname = ?, phonenumber = ? WHERE email = ?";

  // Use global variables to deal with fields that the user left blank.
  if (updateUsernameString == '') 
    updateUsernameString = thisUsername;
  else 
    thisUsername = req.body.updateUsername;

  if (updatePasscodeString == '') 
    updatePasscodeString = thisPasscode;
  else 
    thisPasscode = req.body.updatePasscode;

  if (updateNameString == '') 
    updateNameString = thisName;
  else 
    thisName = req.body.updatePasscode;

  if (updateAddressString == '') 
    updateAddressString = thisAddress;
  else 
    thisAddress = req.body.updateAddress;

  if (updateNicknameString == '') 
    updateNicknameString = thisNickname;
  else 
    thisNickname = req.body.updateNickname;

  if (updatePhonenumberString == '') 
    updatePhonenumberString = thisPhoneNumber;
  else 
    thisPhonenumber = req.body.updatePhonenumber;

  // Now execute MySQL query to update table
  getConnection().query(queryString, [updateUsernameString, updatePasscodeString, updateNameString, updateAddressString, updateNicknameString, updatePhonenumberString, emailString], (err, results, fields) => {
    if (err) {
      console.log("Failed to UPDATE user info.");
      return
    }
  })
  console.log("Updating user's info was successful.");

  // We redirect to the GET method for this user
  var str1 = '/user/'

  var finalStringRedirect = str1.concat(thisEmail);

  res.redirect(finalStringRedirect);  
  return;
})

// GET method for retrieving JSON of user's information based on valid email and passcode.
app.get("/user/:email", (req, res) => {
  console.log("Fetch author with email: " + req.params.email);

  // Open a connection to DB
  const connection = mysql.createConnection({
    host: process.env.MYSQLCONNECTION_HOST,        
    user: process.env.MYSQLCONNECTION_USER,
    password: process.env.MYSQLCONNECTION_PASSWORD,
    database: process.env.MYSQLCONNECTION_DATABASE
  })

  // Declare variables for parameter in route, and String for SQL query
  const anEmailAddress = req.params.email;
  const queryString = "SELECT * FROM user WHERE email = ? AND passcode = ?";
  // Execute a MySQL query to pull data from database
  connection.query(queryString, [anEmailAddress, thisPasscode], (err, rows, fields) => {

    // First check for error in the SQL query
    if (err) {
      console.log("Query failed");
      return
    }

    console.log("Data has been fetched successfully.");
    // Return response to client

    /*
    const users = rows.map((row) => {
      return {AuthorNum: row.authorNum, firstName: row.authorFirst, lastName: row.authorLast}
    */
    const userInfo = rows.map((row) => {
      return {email: row.email, username: row.username, passcode: row.passcode, name: row.name, address: row.address, nickname: row.nickname, phonenumber: row.phonenumber}      
  })
    // Return JSON to client (WORKS)
    res.json(userInfo);

  })
  //res.end();
})

//