const { count } = require('console');
var fs = require('fs');
const { callbackify } = require('util');
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
const sqlite3 = require('sqlite3').verbose();

let db = new sqlite3.Database('./matchaBeauty.db', sqlite3.OPEN_READWRITE, (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Connected to the matcha beauty database.');
});


function addToFavs(username,pid){
    db.run(`INSERT INTO favourites VALUES (?,?)`, [username,pid], (err) => {
        if (err) {
            return err;
        }
            return console.log('inserted into database.');
    });
}

module.exports = {
    addToFavs
}
