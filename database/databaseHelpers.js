var mysql = require('mysql');
var config = require('../config.js')

var connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  database: 'marlowe'
});

connection.connect((err) => {
  if (err) {
    console.log(err);
  } else {
    console.log('database connected');
  }
});

const claimerTable = `CREATE TABLE IF NOT EXISTS claimer (
  id INTEGER AUTO_INCREMENT NOT NULL,
  email VARCHAR(50) NOT NULL,
  address VARCHAR(100),
  org VARCHAR(200),
  phone VARCHAR(12),
  lng VARCHAR(50),
  lat VARCHAR(50),
  cPassword VARCHAR(1000) NOT NULL,
  verified BOOLEAN,
  PRIMARY KEY (id)
)`;

const postTable = `CREATE TABLE IF NOT EXISTS post (
  id INTEGER AUTO_INCREMENT NOT NULL,
  title VARCHAR(100),
  poster_id INTEGER NOT NULL,
  description VARCHAR(255),
  address VARCHAR(200),
  lng VARCHAR(50),
  lat VARCHAR(50),
  phone VARCHAR(12),
  isClaimed BOOLEAN DEFAULT FALSE,
  claimer_id INTEGER,
  createdAt INTEGER,
  photoUrl VARCHAR(3000),
  estimatedValue VARCHAR(50),
  PRIMARY KEY (id),
  FOREIGN KEY (poster_id) REFERENCES claimer(id),
  FOREIGN KEY (claimer_id) REFERENCES claimer(id),
  CHECK (poster_id <> claimer_id)
)`;

connection.query(claimerTable, (error) => {
  if (error) {
    throw error;
  }
})

connection.query(postTable, (error) => {
  if (error) {
    throw error;
  }
})

module.exports = connection;
