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
var axios = require("axios");
var multer = require('multer');
var multerS3 = require('multer-s3');
var aws = require('aws-sdk');
var config = require('../config.js');
var path = require('path');

app.use(express.static(__dirname + "/../client/dist"));
app.use(bodyParser.json());

//Currently the user can create an account, but there isn't any encryption going on - fix it :)
app.use(
  session({
    secret: "this-is-a-secret-token",
    cookie: { maxAge: 600000 },
    resave: true,
    saveUninitialized: true
  })
);

//This is for file uploading to AWS S3. It incorpoates the use of Multer which reads large files such as images, as chunks.
aws.config.update({
    secretAccessKey: process.env.AWS_SECRET,
    accessKeyId: process.env.AWS_KEY,
    region: 'us-east-1'
});
const s3 = new aws.S3();
const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: 'oddjobs-best',
    key: function(req, file, cb) {
      cb(null, `${new Date()}-${file.originalname}`);
    }
  })
});

//This is the middleware used to authenticate the current session.
// const auth = function(req, res, next) {
//   if (!req.session.email && req.url !== '/login' && req.url !== '/current/address' && req.url !== '/signup' && req.url !== '/org') {
//     res.send({notLoggedIn: true})
//     return
//   }
//   next();
// }

// app.use(auth)
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

app.get('/allPosts', function(req, res) {
  db.query(`SELECT * FROM post`, (err, data)=> res.send(data))
})

app.get("/fetch", function(req, res) {
  console.log('in the server fetch')
  let { lng, lat } = req.query
    var query = `SELECT * FROM post WHERE isClaimed=false AND poster_id <>(SELECT id FROM claimer WHERE email="${req.session.email}");`

  db.query(query, (err, results) => {
    console.log('LINE 78', query);
    console.log('LINE 79', results);
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
app.post("/savepost", upload.any(), function(req, res) {
  const listing = req.body;
  const images = req.files.map((image) => image.location)
  const storeImages = `[${images.join(', ')}]`;

  db.query(
    `INSERT INTO post (title, poster_id, description, address, lng, lat, phone, createdAt, photoUrl, estimatedValue)
    VALUES ("${listing.title}", (SELECT id FROM claimer WHERE email="${req.session.email}"), "${listing.description}", "${listing.address}",
    "${listing.longitude}", "${listing.latitude}", "${listing.phone}", "${moment().unix()}", "${storeImages}", "${listing.estimatedValue}");`,
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
  var message = '&bodyText=' + 'You have claimed a donation (' +  req.body.description + ' ) . Please pick-up the donation at : '+  req.body.address + ', \n\n Thanks for using Kindly! \n\n'
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
      bcrypt.compare(req.body.password, results[0].cPassword, (error, result) => {
        if (!error) {
          console.log("Time to session.regenerate()");
          req.session.regenerate(() => {
            req.session.email = req.body.username;
            res.end();
          });
        } else {
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

app.get('/org', function(req, res) {
  db.query(`SELECT org FROM claimer WHERE email="${req.session.email}"`, (err, data) => {
    res.send(!!data[0].org)
  })
})

/************************************************************/
//                   User settings
/************************************************************/

// These routes are for updating user's Settings

app.get("/settings", (req, res) => {
  db.query(`SELECT * FROM claimer WHERE email="${req.session.email}";`,
  (err, results) => {
    if (err) {
      console.log("Failed to retrieve user info");
      res.status(404).send()
    } else {
      console.log('here are the results for getting settings:', results);
      res.send(results);
    }
  });
});

app.put('/settings', (req, res) => {
  let query = ``;
  let {email, address} = req.body;
  if (email && address) {
    console.log('both address and email');

    query = `
      UPDATE claimer
      SET email="${req.body.email}", address="${req.body.address}"
      WHERE email="${req.session.email}";
    `
  } else if (email) {
    console.log('just email, no address');
    query = `
      UPDATE claimer
      SET email="${req.body.email}"
      WHERE email="${req.session.email}";
    `
  } else if (address) {
    console.log('just address, no email');
    query = `
      UPDATE claimer
      SET address="${req.body.address}"
      WHERE email="${req.session.email}";
    `
  } else {
    res.status(400).send()
  }

  db.query(query, (err, result) => {
    if (err) {
      res.status(500).send('uh oh spaghettio in app.post:/settings');
      throw err;
    }
    res.send(result)
  })
})

/************************************************************/
//                   twilio
/************************************************************/

//Twillio provides a fun/helpful feature to send users a text message on their phone if their post was claimed by another user.
//Twilio account is under a free-trial subscription - you will need to sign up if you want to keep this feature AND change the credentials, please.

// app.post("/chat", function(req, res) {
//   var accountSid = "AC295216dc5e0bd27a16271da275b0c36f"; // You can creae/retrieve your Account SID from www.twilio.com/console
//   var authToken = "14a805bc4b3f3c784aaa5e4e16acc449"; // You can creae/retrieve your Auth Token from www.twilio.com/console
//   var client = new twilio(accountSid, authToken);

//   client.messages
//     .create({
//       body: `Thank you for claiming ${req.body.title} and helping the world !`,
//       to: '+19296660205', // Text this number - this is hard coded unless you'd like to upgrade your account =)
//       from: "+14255054003 " // From a valid Twilio number
//     })
//     .then(message => {
//       var client2 = new twilio(accountSid, authToken);
//       client2.messages
//         .create({
//           body: `Your posting ${req.body.title} has been claimed ! You'll be contacted soon !`,
//           to: +'19162567256', // Text this number this is hard coded unless you'd like to upgrade your account =)
//           from: "+14255054003 " // From a valid Twilio number
//         })
//         .then(message => {
//           res.end();
//         });
//       // res.end()
//     });
// });

app.post("/email", (req,res)=>{
  var data = req.body
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

app.post('/verified/email', (req, res) => {
    var data = req.body
    console.log('sending email')
    var rootUrl = 'https://api.elasticemail.com/v2/email/send?apikey=11247b43-8015-4e70-b075-4327381d0e0f'
    var subject = '&subject=REQUEST FOR VERIFICATION'
    var sender = '&from=' + 'kindlyverify@gmail.com'
    var senderName = '&fromName' + 'Kindly Webmaster'
    var receiver = '&to=kindlywebmasters@gmail.com' //donaters email address
    var message = '&bodyText=' + 'The following organization/user is requesting verification: \t ' + `${data.email}`
    + '\n\n To verify the user, click the following link : \n\n' + `http://localhost:3000/user/verified/?id=${data.id}`
    + '\n\n To deny user verification, click the following link: \n\n' + `http://www.localhost:3000/user/notVerified/?id=${data.id}` + '\n\n'
    var isTransactional = '&isTransactional=true'

    var URL = rootUrl + subject + sender + senderName + receiver + message + isTransactional

    axios.post(URL)
    .then((response) => {
      console.log('sent')
      res.send(response.data)
    })
    .catch((err) => {
      console.log(err)
    })
  })

app.get('/user/verified', (req, res) => {
  console.log('this is req', req)
  console.log('this is req.url', req.url);
  console.log('this is req.query', req.query);
  var sqlQuery = `UPDATE claimer SET verified = true WHERE id = ${req.query.id}`;
  db.query(sqlQuery, (error) => {
    if (error) {
      res.send(error);
    }
    res.end();
  })
})

app.get('/user/notVerified', (req, res) => {
    var sqlQuery = `UPDATE claimer SET verified = false WHERE id = ${req.query.id}`;
    db.query(sqlQuery, (error) => {
    if (error) {
      res.send(error);
    }
    res.end();
  })
})

/************************************************************/
//                   deduction
/************************************************************/


// Function creates this object form database and charity navigator api


  /*
    {years: [2017, 2018],
    organizations: [
     org id: {
       orgInfo {
         org: name,
         ein: 1234,
         verified: true
       },
       donations: [
         {
            created_at,
            item,
            value
          },
          {
            created_at,
            item,
            value
          },
       ]
    }
    ]
  }
  */

app.get('/donations', (req, res)=> {
  // get all claimed posts for this user

  db.query(`SELECT * FROM post WHERE isClaimed=TRUE AND poster_id=(SELECT id FROM claimer WHERE email=${req.session.email})`, (err, results)=> {

    var output = {years:[], organizations:{}}

    results.forEach(donation => {

      // if year does not exist, push to years array
      var year = new Date(donation.createdAt * 1000).getFullYear()
      if (!output.years.includes(year)) {
        output.years.push(year)
      }

      //if organization does not yet exist in output, create that organization
      if(!output.organizations[donation.poster_id]) {
        output.organizations[donation.poster_id] = {donations:[]} // add org info at end
      }

      // push dontation to it's organization's donation array
      output.organizations[donation.poster_id].donations
        .push({item: donation.title, value: donation.estimatedValue, createdAt: donation.createdAt})
    })

    return Promise.all(Object.keys(output.organizations).map(orgId =>
      new Promise((resolve)=> {
        // get org name and verified status
        db.query(`SELECT org, verified FROM claimer WHERE id=${orgId}`, (err, info) => {
         let orgName = info[0].org
         let verified = info[0].verified

         if (orgName === null) {
           res.send('not valid org name')
           return
         }

         // get ein number and deductibility status from charity navigator
          axios.get(`https://api.data.charitynavigator.org/v2/Organizations`,
            {params: {
              app_id: process.env.CHARITY_ID || config.charityNav.id,
              app_key: process.env.CHARITY_KEY || config.charityNav.key,
              pageSize: 1,
              pageNum: 1,
              search: orgName
            }}
          ).then(charityData => {
            let ein = charityData.data[0].ein
            let deductable = charityData.data[0].irsClassification.deductibility

            // Each promise resolves with this org info object
            resolve({id: orgId, orgName, ein, deductable, verified})
          })
          .catch(err => {
            console.log('err')
            res.send(404, 'error')
          })
        })
      })
    ))
    .then(data => {
      data.forEach(org => {

        // attach the  org info object to each org in output.organizations
        output.organizations[org.id].orgInfo = org
        delete output.organizations[org.id].orgInfo.id
      })
    })
    .then(()=> {
      res.send(output)
    })
    .catch((err) => {
      console.log(err)
      res.send(500, err)
    })
  })
})

app.get('/*', (req, res) => {
  res.send(path.join(__dirname, "../client/dist"));
})

var port = process.env.PORT;
app.listen(port, function() {
  console.log('CONNECTED TO PORT', port)
});
