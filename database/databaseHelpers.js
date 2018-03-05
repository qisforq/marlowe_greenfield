var mysql = require('mysql');
var config = require('../config.js')

var connection = mysql.createConnection({
  host: config.host,
  user: config.user,
  password: config.password,
  port: config.port,
  database: config.database
});

connection.connect((err) => {
  if (err) {
    console.log(err);
  } else {
    console.log('database connected');
  }
});

//IF you need to drop tables on the hosted database, uncomment the below:
// connection.query(`DROP TABLE IF EXISTS post`, (err, res) => {
// if (err) console.log(err)
// })

connection.query(`CREATE TABLE IF NOT EXISTS provider (
id INTEGER AUTO_INCREMENT NOT NULL,providerUsername VARCHAR(16),
pPassword VARCHAR(16),PRIMARY KEY(id));`
, (err, results) => {
  if (err) console.log(err)
})

connection.query(`CREATE TABLE IF NOT EXISTS claimer (
  id INTEGER AUTO_INCREMENT NOT NULL,
  claimerUsername VARCHAR(16),
  claimerZipCode INTEGER NOT NULL,
  cPassword VARCHAR(16),
  PRIMARY KEY (id)
);`, (err, res) => {
if (err) console.log(err)
})

connection.query(`CREATE TABLE IF NOT EXISTS post (
  id INTEGER AUTO_INCREMENT NOT NULL,
  title VARCHAR(100),
  username VARCHAR(20),
  description VARCHAR(255),
  address VARCHAR(50),
  city VARCHAR(25),
  state VARCHAR(2),
  zipCode VARCHAR(6),
  phone VARCHAR(12),
  isClaimed BOOLEAN,
  emailAddress VARCHAR(50),
  createdAt INTEGER,
  photoUrl VARCHAR(512),
  PRIMARY KEY (id)
)`, (err, res) => {
if (err) console.log(err)
})


module.exports = connection;
