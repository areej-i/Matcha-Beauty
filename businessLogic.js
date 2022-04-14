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

// /***********************************
// Parameter is object with username, password
// ************************************/
var usernames = [];
var passwords = [];
var emails = [];

var i = 0;
var sql = `SELECT username FROM user
     ORDER BY username`;

db.all(sql, [], (err, rows) => {
    if (err) {
        throw err;
    }
    rows.forEach((row) => {
        usernames[i] = row.username;
        i++;
    });
});

var k = 0;
sql = `SELECT password FROM user
     ORDER BY username`;

db.all(sql, [], (err, rows) => {
    if (err) {
        throw err;
    }
    rows.forEach((row) => {
        passwords[k] = row.password;
        k++;
    });
});

function login(username,password)
{
    for(var j = 0; j < usernames.length; j++){
        if (usernames[j] == username && passwords[j] == password){
            return true;
        }
    }
  return false;
}

var g = 0;
sql = `SELECT email FROM user
     ORDER BY username`;

db.all(sql, [], (err, rows) => {
    if (err) {
        throw err;
    }
    rows.forEach((row) => {
        emails[g] = row.email;
        g++;
    });
});

function doesExist(username,email)
{
    for(j = 0; j < usernames.length; j++){
        if (usernames[j] == username && emails[j] == email){
            return true;
        }
    }
  return false;
}

function checkout(name,cardNum,exp,cvv,credit)
{
    cc = `(`+credit +`,`+name+`,`+exp+`,`+cardNum+`,`+cvv+`)`
    sql = `INSERT INTO creditcard
          VALUES ` + cc;

    db.all(sql, [], (err) => {
        if (err) {
            throw err;
        }
    });
}

function help(username,password,email,ccid){
    db.run(`INSERT INTO user VALUES (?,?,?,?)`, [username,password,email,ccid], (err) => {
        if (err) {
            return err;
        }
            return console.log('inserted into database.');
    });
}

function addToFavs(){
    db.run(`INSERT INTO favourites VALUES (?,?)`, ['user1','P1'], (err) => {
        if (err) {
            return err;
        }
        return console.log('inserted into favourites.');
    });
  }
// .shop-item(style='width:290px; margin-left:2%; margin-top: 2%; height: 404px; float:left')
//             .image 
//               img.shop-item-image(src='/'+session.image[0] alt='makeup' style='margin-left:10%; margin-top: 2%; margin-bottom: 3%; width: 250px; box-shadow: 0 4px 7px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19); text-align: center;')
//             .content(style='text-align:center;')
//               label#name(style='font-weight: 600') !{session.names[0]}
//               label#brand !{session.brand[0]}
//               label#price $!{session.price[0]}
//             .action 
//               button#addToCart(type='button' onclick='bag('+session.pid[0]+','+session.names[0]+')' style='font-size: 20px; margin-left: 35%') add to cart

function favs(username){

    let x = 0;
    let favPid = [];
    let sql2 = `SELECT pid FROM favourites WHERE username = '`+username+`'`;

    db.all(sql2, [], (err, rows) => {
        if (err) {
            return console.log(err.message);
        }
        rows.forEach((row) => {
            favPid[x] = row.pid;
            x++;
        });
        console.log('successful favs.');
    });

    console.log(favPid[0]);
    return favPid;
}

module.exports = {
    login,
    checkout,
    doesExist,
    help,
    favs,
    addToFavs
}