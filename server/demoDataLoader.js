const bcrypt = require('bcrypt')
const db = require('../database/databaseHelpers.js')
const mysql = require('mysql')

const createPassword = function(user) {
  const saltBae = 10;
  return bcrypt.hash(user[6], saltBae)
    .then((hash)=> {
      user[6] = hash
      return user
    })
    .catch((err) => {
      console.log('Issue with createPassword hashing', err)
    })
}

const insertUsersQuery = 'INSERT INTO claimer (email, address, org, phone, lat, lng, cPassword, verified) VALUES ?;'
const demoUsers = [
  ['Jerry@email.email', "89 E 42nd St, New York, NY 10017, USA", null, '5555555', '40.75272619999999', '-73.9772294', 'jerry', null],
  ['Eric@email.email', "Empire State Building, New York, NY 10001, US", null, '5555555', '40.7485413', '-73.98575770000002', 'eric', null],
  ['Quentin@email.email', "Union Square, New York, NY 10003, USA", null, '5555555', '40.7358633', '-73.9910835', 'quentin', null],
  ['Riley@email.email', "369 Lexington Avenue, 11th Floor, New York, NY 10017, USA", null, '5555555', '40.75048649999999', '-73.97640100000001', 'riley', null],
  ['Unicef@email.email', "3 United Nations Plaza, New York, NY 10017, USA", 'UNICEF', '5555555', '40.75040190000001', '-73.96991659999998', 'unicef', true],
  ['ARealCharity@email.email', "Trump Tower, 725 5th Ave, New York, NY 10022, USA", 'A Real Charity', '5555555', '40.7623737', '-73.97391189999', 'trump', null]
]

Promise.all(demoUsers.map(user => {
  return createPassword(user)
}))
  .then((hashedDemoUsers)=> {
    db.query(insertUsersQuery, [hashedDemoUsers], (err) => {
      if (err) console.log('error inserting demo users', err)
      else {
        console.log('inserted demo users')

        const insertQuery = 
        `INSERT INTO post (title, poster_id, description, address, lat, lng, phone, isClaimed, claimer_id, createdAt, photoUrl, estimatedValue) VALUES ?;`
        const demoPosts = [
        ]
      } 
    })
  })