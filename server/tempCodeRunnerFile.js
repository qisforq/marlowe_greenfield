var db = require("../database/databaseHelpers");

db.query(`SELECT org, verified FROM claimer WHERE id=1`, (err, info) => {
  console.log(info)
})