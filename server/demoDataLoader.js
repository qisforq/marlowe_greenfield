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
      process.exit()
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
      if (err)  {
        console.log('error inserting demo users', err)
        process.exit()
      }
      else {
        console.log('inserted demo users')

        const insertPostsQuery =
        `INSERT INTO post (title, poster_id, description, address, lat, lng, phone, isClaimed, claimer_id, createdAt, photoUrl, estimatedValue) VALUES ?;`
        const demoPosts = [
          // Jerry
          ["DONATING MY LIFE", 1, "MY LIFE IS WORTHLESSSSSSSS. JUST KIDDING ITS WORTH 500", "2348 7th Ave, New York, NY 10030, USA", "-73.94280520000001", "40.8171364", "1234567890", 0, null, 1520543425, "[]", "500"],
          ["I'm just a boy, giving out some love", 1, "Free love", "2345 4th Ave, Brooklyn, NY 11232, USA", "-74.0060355", "40.6523829", "1234567890", 0, null, 1520543530, "[]", "80"],
          ["Giving away my socks", 1, "They aren't that dirty, promise <3", "2340 5th Ave, New York, NY 10037, USA", "-73.93495289999998", "40.816982", "213578291", 0, null, 1520543556, "[]", "120"],
          ["Donating some old toys", 1, "Just donating some old toys!", "49 3rd Ave, New York, NY 10003, USA", "-73.99054860000001", "40.7286602", "1234567890", 0, null, 1520543599, "[]", "90"],
          ["Giving away my hair", 1, "Shaved off my whole head. Take my hair", "2311 5th Ave, New York, NY 10037, USA", "-73.93530850000002", "40.815517", "123456778", 0, null, 1520543664, "[]", "35"],

          // Eric
          ["Donating Jerry's whole life", 2, "IT ISN'T WORTH $500. It is PRICELESS!", "369 Lexington Ave #401, New York, NY 10017, USA", "-73.97640409999997", "40.750471", "7182311234", 0, null, 1520544240, "[]", "1"],
          ["Sweet Baby Kitten", 2, "PLEASE TAKE HER FROM ME, I WILL DROP HER OFF AT GRAND CENTRAL TERMINAL'S GRAND CONCOURSE!", "89 E 42nd St, New York, NY 10017, USA", "-73.9772294", "40.75272619999999", "7189114938", 0, null, 1520544310, "[]", "450"],
          ["DONATING my son's xbox", 2, "", "Empire State Building, New York, NY 10001, USA", "-73.98575770000002", "40.7485413", "124297752", 0, null, 1520544433, "[]", "200"],
          ["Donating a dozen donughts", 2, "Glazed only", "Hell's Kitchen, New York, NY, USA", "-73.99181809999999", "40.7637581", "9112132124", 0, null, 1520544706, "[]", "12"],
          ["50 Chicken nuggets", 2, "", "Hell's Kitchen, New York, NY, USA", "-73.99181809999999", "40.7637581", "12431212", 0, null, 1520544902, "[]", "13"],

          // Quentin - Use for Donation ammount demo
          ["Moving Give Away ", 3, "Giving away stuff from moving sale. Furniture, clothes etc.", "259 1st St, Mineola, NY 11501, USA", "-73.64318709999998", "40.74097860000001", "555 5555", 1, 5, 1520609853, "[]", "200"],
          ["Canned food and Bottled Water", 3, "A few food items for donation", "New York, NY 10003, USA", "-73.99646089999999", "40.72951339999999", "555 5555", 1, 5, 1520609929, "[]", "60"],
          ["Desktop Computer", 3, "Late 2013 iMac computer", "Astoria, Queens, NY, USA", "-73.9234619", "40.7643574", "555 5555", 0, null, 1520609969, "[]", "900"],
          ["XBOX", 3, "XBOX One with a few games. Maybe useful for a children's hospital", "New York, NY 10018, USA", "-73.98323260000001", "40.7535965", "555 5555", 1, 5, 1520610009, "[]", "400"],
          ["iPhone 6", 3, "Working iPhone 6.", "Bank of America Tower, New York, NY 10036, USA", "-73.98493129999997", "40.7556029", "555 5555", 0, null, 1520610046, "[]", "300"],
          ["Canada Goose Jacket", 3, "That one jacket that everyone has. You can have one too!", "Midtown, New York, NY, USA", "-73.98401949999999", "40.7549309", "555 5555", 1, 5, 1520610082, "[]", "1500`"],
          ["Coffee", 3, "Extra bag of coffee beans", "16 W 23rd St, New York, NY 10010, USA", "-73.990456", "40.741602", "555 5555", 0, null, 1520610120, "[]", "12"],
          ["Art Supplies", 3, "A whole collection of school art supplies. Enough for a class of ~ 20", "New York, NY 10174, USA", "-73.9755189", "40.75175779999999", "555 5555", 1, 6, 1520610374, "[]", "300"],
          ["Laser tag party for group of 15", 3, "Giving away a laser tag party for a group of 15. Great for a kids party", "62 Chelsea Piers, New York, NY 10011, USA", "-74.00853560000002", "40.7480678", "555 5555", 1, 5, 1520610466, "[]", "600"],
          ["Computer monitor", 3, "Done with HackReactor - giving away my monitor!", "369 Lexington Avenue, 11th Floor, New York, NY 10017, USA", "-73.97640100000001", "40.75048649999999", "555 5555", 1, 6, 1520610547, "[]", "140"]
        ]

          db.query(insertPostsQuery, [demoPosts], (err) => {
            if (err) console.log('error inserting demo posts', err)
            else {
              console.log('inserted demo posts')
              }
              process.exit()
          })
        }
    })
  })
