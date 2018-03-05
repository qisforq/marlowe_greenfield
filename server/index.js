var express = require("express");
var bodyParser = require("body-parser");
var request = require("request");
var db = require("../database/databaseHelpers");
var session = require("express-session");
var twilio = require("twilio");
var app = express();
var moment = require("moment");
var geo = require("./geoHelper.js")

app.use(express.static(__dirname + "/../client/dist"));
app.use(bodyParser.json());

//Currently the user can create an account, but there isn't any encryption going on - fix it :)
app.use(
  session({
    secret: "this-is-a-secret-token",
    cookie: { maxAge: 60000 },
    resave: true,
    saveUninitialized: true
  })
);

// Due to express, when you load the page, it doesnt make a get request to '/', it simply serves up the dist folder
//Recommend inplementing a wild-card route app.get('/*')...

/************************************************************/
//                   General Routes
/************************************************************/

//This route fetches all posting from the database and sends them to the client
//later this function should receive the zip code of the authenticated user and display
//only relevant postings to the user
app.get("/fetch", function(req, res) {
  db.query("SELECT * FROM post WHERE isClaimed=false;", (err, results) => {
    if (err) console.log("FAILED to retrieve from database");
    else {
      res.send(results);
    }
  });
});

//This route receives a request upon submit from the form. The form holds all fields necesaary
//to make a new db entry. This route will take in the request and simply save to the db
app.post("/savepost", function(req, res) {
  var listing = req.body;
  db.query(
    `INSERT INTO post (title, description, address, city, state, zipCode, phone, isClaimed, createdAt, photoUrl) VALUES ("${
      listing.title
    }", "${listing.description}", "${listing.address}","${listing.city}", "${
      listing.state
    }", "${listing.zipCode}", "${listing.phone}", ${
      listing.isClaimed
    }, "${moment().unix()}", "${listing.photoUrl}");`,
    (err, data) => {
      res.end();
    }
  );
});

app.post("/latlong", function(req, res) {

  //This function is using geohelper function which utilizes Google's geocoder API
  //Note: if an invalid address is passed to this method, it will cause the server to crash
  // due to the map not being able to find a real address. Recommend: Implement google maps auto
  // complete on the form to always guarantee a correct address

  geo(req.body.address, function(lat, long) {
    let result = {lat: lat, long: long};
    res.send(result);
    res.end();
  });
});

//This route handles updating a post that has been claimed by the user
app.post("/updateentry", function(req, res) {
  var postID = req.body.postID;
  db.query(
    `UPDATE post SET isClaimed=true WHERE id="${postID}"`,
    (err, data) => {
      res.end();
    }
  );
});

/************************************************************/
//                   authentication
/************************************************************/

//As mentioned above, user passwords are not encrypted - just plain text passwords
//Also note, a 'claimer' is the same as a 'user' - all accounts are can Create and Claim posts - we intentionally
//wanted to create separate "Claimer" and "Provider" accounts; that's now up to you to decide :)
app.post("/signup", function(req, res) {
  var sqlQuery = `INSERT INTO claimer (claimerUsername, claimerZipCode, cPassword) VALUES (?, ?, ?)`;
  var placeholderValues = [ req.body.username, req.body.zipcode, req.body.password ];
  db.query(sqlQuery, placeholderValues, function(error) {
    console.log(sqlQuery);
    if (error) {
      throw error;
    } else {
      res.end();
    }
  });
});

app.post("/login", function(req, res) {
  var sqlQuery = `SELECT claimerUsername FROM claimer WHERE claimerUsername="${req.body.username}" AND cPassword ="${req.body.password}"`;
  db.query(sqlQuery, function(error, results) {
    if (error) {
      throw error;
    } else if (results.length === 0) {
    } else {
      req.session.regenerate(err => {
        req.session.username = req.body.username;
      });
      res.end();
    }
  });
});

/************************************************************/
//                   twilio
/************************************************************/

//Twillio provides a fun/helpful feature to send users a text message on their phone if their post was claimed by another user.
//Twilio account is under a free-trial subscription - you will need to sign up if you want to keep this feature AND change the credentials, please.

app.post("/chat", function(req, res) {
  var accountSid = "AC295216dc5e0bd27a16271da275b0c36f"; // You can creae/retrieve your Account SID from www.twilio.com/console
  var authToken = "14a805bc4b3f3c784aaa5e4e16acc449"; // You can creae/retrieve your Auth Token from www.twilio.com/console
  var client = new twilio(accountSid, authToken);

  client.messages
    .create({
      body: `Thank you for claiming ${req.body.title} and helping the world !`,
      to: '+19296660205', // Text this number - this is hard coded unless you'd like to upgrade your account =)
      from: "+14255054003 " // From a valid Twilio number
    })
    .then(message => {
      var client2 = new twilio(accountSid, authToken);
      client2.messages
        .create({
          body: `Your posting ${req.body.title} has been claimed ! You'll be contacted soon !`,
          to: +'19162567256', // Text this number this is hard coded unless you'd like to upgrade your account =)
          from: "+14255054003 " // From a valid Twilio number
        })
        .then(message => {
          res.end();
        });
      // res.end()
    });
});

var _PORT = process.env.PORT || 3000;
app.listen(_PORT, function() {
});
