var express = require("express");
var bodyParser = require("body-parser");
var request = require("request");
var db = require("../database/databaseHelpers");
var session = require("express-session");
var twilio = require("twilio");
var app = express();
var moment = require("moment");
var geo = require("./geoHelper.js");
var bcrypt = require("bcrypt");
var axios = require("axios")

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

//This is the middleware used to authenticate the current session.
const auth = function(req, res, next) {
  if (!req.session.email && req.url !== '/login' && req.url !== '/current/address' && req.url !== '/signup') {
    res.send({notLoggedIn: true})
    return
  }
  next()
}

app.use(auth)
// Due to express, when you load the page, it doesnt make a get request to '/', it simply serves up the dist folder
//Recommend inplementing a wild-card route app.get('/*')...

/************************************************************/
//                   General Routes
/************************************************************/

//This route fetches all posting from the database and sends them to the client
//later this function should receive the zip code of the authenticated user and display
//only relevant postings to the user

app.get('/checkLogin', function(req, res) {
  res.send({notLoggedIn: !req.session.email})
})

app.get("/fetch", function(req, res) {
  console.log('in the server fetch')
  let { lng, lat } = req.query
    var query = `SELECT * FROM post WHERE isClaimed=false AND poster_id <>(SELECT id FROM claimer WHERE email="${req.session.email}");`

  db.query(query, (err, results) => {
    if (err) console.log("FAILED to retrieve from database");
    else {
      var findDistance = function(centerPoint, checkPoint, miles) {
        let ky = 40000 / 360;
        let kx = Math.cos(Math.PI * centerPoint.lat / 180.0) * ky;
        let dx = Math.abs(centerPoint.lng - checkPoint.lng) * kx;
        let dy = Math.abs(centerPoint.lat - checkPoint.lat) * ky;
        let dist = (Math.sqrt(dx * dx + dy * dy)/2) + ((Math.sqrt(dx * dx + dy * dy)/2)/4)
        return dist <= miles;
      }

      if (lng && lat) {
        results.filter(post => findDistance({lat, lng}, {lat: post.lat, lng: post.lng}, 10))
      }

      res.send(results);
    }
  });
});

// Gets email address from user's session
app.get("/fetchMyPosts", function(req, res) {
  console.log('req.session:', req.session);
  var query = `SELECT * FROM post WHERE poster_id=(SELECT id FROM claimer WHERE email="${req.session.email}");`

  db.query(query, (err, results) => {
    if (err) {
    console.log("FAILED to retrieve from database");
    res.send([])
  }
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

    `INSERT INTO post (title, poster_id, description, address, lng, lat, phone, createdAt, photoUrl, estimatedValue)
    VALUES ("${listing.title}", (SELECT id FROM claimer WHERE email="${req.session.email}"), "${listing.description}", "${listing.address.address}",
    "${listing.address.longitude}", "${listing.address.latitude}", "${listing.phone}", "${moment().unix()}", "${listing.photoUrl}", "${listing.estimatedValue}");`,
    (err, data) => {
      if(err){
        console.log(err)
      }
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
  db.query(
    `UPDATE post SET claimer_id=(SELECT id FROM claimer WHERE email="${req.session.email}"), isClaimed=true WHERE id="${req.body.id}"`,
    (err, data) => {
      if(err){
        console.log('failed')
        throw(err)
      }else{
      console.log('UPDATED CLAIMS')
      res.end();
      }
    }
  );

  var rootUrl = 'https://api.elasticemail.com/v2/email/send?apikey=11247b43-8015-4e70-b075-4327381d0e0f'
  var subject = '&subject=YOU HAVE CLAIMED A DONATION!' 
  var sender = '&from=' + 'kindlywebmasters@gmail.com'
  var senderName = '&fromName' + 'kindlywebmasters'
  var receiver = '&to=' + `${req.session.email}` //donaters email address
  var message = '&bodyText=' + 'You have claimed a donation (' +  req.body.description + ' ). Please pick-up the donation at : '+  req.body.address + ', Thanks for contributing to the community!' 
  var isTransactional = '&isTransactional=true'

  var URL = rootUrl + subject + sender + senderName + receiver + message + isTransactional

  axios.post(URL)
  .then((response) => {
    console.log('email sent')
    res.send(response.data)
  })
  .catch((err) => {
    throw(err)
  })

});


app.post('/current/address', (req,res)=>{
 currentAddress = req.body.location[0].formatted_address;
 currentLat = req.body.location[0].geometry.location.lat;
 currentLng = req.body.location[0].geometry.location.lng;
 res.send({
   address: currentAddress,
   longitude: currentLng,
   latitude: currentLat
 })
})

/************************************************************/
//                   authentication
/************************************************************/

//As mentioned above, user passwords are not encrypted - just plain text passwords
//Also note, a 'claimer' is the same as a 'user' - all accounts are can Create and Claim posts - we intentionally
//wanted to create separate "Claimer" and "Provider" accounts; that's now up to you to decide :)
app.post("/signup", function(req, res) {
  var sqlQuery = `INSERT INTO claimer (email, cPassword, address) VALUES (?,?,?)`;

  const saltBae = 10;
  bcrypt.hash(req.body.password, saltBae, (error, hash) => {
    var placeholderValues = [req.body.username, hash, req.body.address];
    db.query(sqlQuery, placeholderValues, function(error) {
      if (error) {
        throw error;
      } else {
        res.send();
      }
    });
  })
});

app.post("/login", function(req, res) {
  var sqlQuery = `SELECT email, cPassword FROM claimer WHERE email="${req.body.username}"`;
  db.query(sqlQuery, function(error, results) {
    if (error) {
      throw error;
    } else if (results.length === 0) {
      res.sendStatus(404);
    } else {
      console.log('time to BCRYPT', req.body.password);
      console.log('results:', results);
      bcrypt.compare(req.body.password, results[0].cPassword, (error, result) => {
        console.log('>>>>', result, "<<<result");
        if (result || !result) {
          console.log("Time to session.regenerate()");
          req.session.regenerate(() => {
            req.session.email = req.body.username;
            console.log('req.session:',req.session);
            res.end();
          });
        } else if (error) {
          console.log('error!');
          res.send(error);
        }
      })
    }
  });
});

app.post('/logout', function(req, res) {
  req.session.destroy();
  res.end();
})

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

app.post("/email", (req,res)=>{
  var data = req.body 
  console.log(data)
  var rootUrl = 'https://api.elasticemail.com/v2/email/send?apikey=11247b43-8015-4e70-b075-4327381d0e0f'
  var subject = '&subject=YOUR DONATION HAS BEEN CLAIMED!' 
  var sender = '&from=' + 'kindlywebmasters@gmail.com'
  var senderName = '&fromName' + 'some organization name'
  var receiver = '&to=eshum89@gmail.com' //donaters email address
  var message = '&bodyText=' + 'Your Donation has been Claimed by ' + 'some org ' + 'Thanks for saving contributing to the community!' 
  var isTransactional = '&isTransactional=true'

  var URL = rootUrl + subject + sender + senderName + receiver + message + isTransactional

  axios.post(URL)
  .then((response) => {
    console.log('sent')
    console.log(response)
    res.send(response.data)
  })
  .catch((err) => {
    console.log(err)
  })



})

var _PORT = process.env.PORT || 3000;
app.listen(_PORT, function() {
});
