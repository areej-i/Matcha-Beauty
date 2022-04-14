const express = require('express');
const app = express();
const fs = require('fs');
const model = require('./businessLogic.js')
const path = require('path');
// const io = require('socket.io')(server)
const pug = require('pug');
const sqlite3 = require('sqlite3').verbose();

app.use(express.json());
app.set('views',path.join(__dirname,'views'));
app.set('public',path.join(__dirname,'public'));
app.set('view engine','pug');
app.use(express.urlencoded({extended:true}));

//Create session
const session = require('express-session');
//const { searchUsers } = require('./businessLogic.js');
app.use(session({ 
    cookie:{ maxAge: 1000000000000},
    secret: 'hello cat',
    resave: true,
    saveUninitialized: true
}));


app.use("/", function(req, _res, next)
{
    console.log(req.session);
    console.log("Request from user: " + req.session.username);
    next();
});

app.use(express.static(__dirname +'/public'))

//Rendering pages
app.get('/',(req,res)=>{
    res.render('home',{session:req.session});
})
app.get('/home',(req,res)=>
{
    res.render('home',{session:req.session});
})
app.get('/all',(req,res)=>{
    res.render('all',{session:req.session});
})
app.get('/account',(req,res)=>
{
    res.render('account',{session:req.session});
})
app.get('/bestselling',(req,res)=>
{
    res.render('bestselling',{session:req.session});
})
app.get('/lips',(req,res)=>{
    res.render('lips',{session:req.session});
})
app.get('/face',(req,res)=>{
    res.render('face',{session:req.session});
})

/**********************  accessing database  **********************/

var productNames = [];
var productPid = [];
var productPrice = [];
var productCategory = [];
var productSales = [];
var productBrand = [];
var productQuantity = [];
var productImage = [];
var favPid = [];
var favUser = [];
var orderPid = [];
var orderCcid = [];
var orderDate = [];
var orderQuantity = [];
var orderStatus = [];
var userCCid = [];
var temp = [];
var userName = [];
var i = 0;

let db = new sqlite3.Database('./matchaBeauty.db', sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
      console.error(err.message);
    }
    console.log('Connected to the matcha beauty database.');
  });

let sql = `SELECT * FROM product ORDER BY pid`;

db.all(sql, [], (err, rows) => {
    if (err) {
        return console.log(err.message);
    }
    rows.forEach((row) => {
        productNames[i] = row.name;
        productPrice[i] = row.price;
        productBrand[i] = row.brand;
        productPid[i] = row.pid;
        productCategory[i] = row.category;
        productSales[i] = row.sales;
        productImage[i] = row.image;
        productQuantity[i] = row.quantity;
        i++;
    });
});

var cnt = 0;
db.all(`SELECT ccid FROM user ORDER BY username`, [], (err, rows) => {
    if (err) {
        return console.log(err.message);
    }
    rows.forEach((row) => {
        temp[cnt] = row.ccid;
        cnt++;
    });
});

db.all(`SELECT * FROM favourites ORDER BY username`, [], (err, rows) => {
    if (err) {
        return console.log(err.message);
    }
    rows.forEach((row) => {
        favPid[i] = row.pid;
        favUser[i] = row.username;
        i++;
    });
});

var g = 0;
db.all(`SELECT * FROM orders ORDER BY ccid`, [], (err, rows) => {
    if (err) {
        return console.log(err.message);
    }
    rows.forEach((row) => {
        orderPid[g] = row.pid;
        orderStatus[g] = row.status;
        orderDate[g] = row.date;
        orderCcid[g] = row.ccid;
        orderQuantity[g] = row.quantity;
        g++;
    });
});

db.all(`SELECT * FROM user ORDER BY username`, [], (err, rows) => {
    if (err) {
        return console.log(err.message);
    }
    rows.forEach((row) => {
        userCCid[i] = row.ccid;
        userName[i] = row.username;
        i++;
    });
});


/**********************  Handling Log in  *************************/

app.get('/login',(req,res)=>
{
    res.render('login',{session:req.session});
})
app.post('/loginUser', loginUser);
function loginUser (req, res)
{
    console.log("Trying to log in with: "+req.body.username);
    if(session.loggedin)
    {
        res.status(401).send("You are already logged in");
    }
    else
    {
        if(model.login(req.body.username, req.body.password))
        {   
            createSession(req, res);
        }
        else
        {   //they did not log in successfully.
            alert("Wrong username or password was entered.");
        }
    }

}
app.get("/logOut", function logOut(req,res)
{
    req.session.destroy();
    res.redirect('/home');
})

/**********************  Handling Log in  *************************/

function createSession(req, res){
    req.session.username = req.body.username;
    req.session.loggedin = true;
    eyesImage = [];
    eyesNames = [];
    eyesBrand = [];
    eyesQuantity = [];
    eyesPrice = [];
    eyesPid = [];
    favouritePid = [];
    favouriteImage = [];
    favName = [];
    orderImage = [];
    userOrders = [];
    orderName = [];

    var ccid;

    var b = 0;
    for(i = 0; i < productImage.length; i++)
    {
        if (productCategory[i] == 'eyes')
        {
            eyesImage[b] = productImage[i];
            eyesNames[b] = productNames[i];
            eyesBrand[b] = productBrand[i];
            eyesPid[b] = productPid[i];
            eyesQuantity[b] = productQuantity[i];
            eyesPrice[b] = productPrice[i];
            b++;
        }
    }

    console.log(favPid)
    console.log(favUser)
    
    var z = 0;
    for(i = 0; i < favUser.length; i++)
    {
        if (favUser[i] == req.session.username)
        {
            favouritePid[z] = favPid[i];
            z++;
        }
    }

    var zr = 0;
    for(i = 0; i < productImage.length; i++)
    {
        if (favouritePid[zr] == productPid[i])
        {
            favName[zr] = productNames[i];
            favouriteImage[zr] = productImage[i];
            zr++;
        }
    }

    for(i = 0; i < userName.length; i++){
        if(userName[i] == req.session.username){
            ccid = userCCid[i];
        }
    }

    var zt = 0;
    for(i = 0; i < orderCcid.length; i++)
    {
        if (orderCcid[i] == ccid)
        {
            userOrders[zt] = orderPid[i]; //gets orders for the specific user
            zt++;
        }
    }

    userOrders.sort();

    var vr = 0;
    for(var v = 0; v < productImage.length; v++)
    {
        if (userOrders[vr] == productPid[v])
        {
            orderName[vr] = productNames[v];
            orderImage[vr] = productImage[v]; //gets image for the specific orders
            vr++;
        }
    }

    req.session.orderName = orderName;
    req.session.orderPid = orderPid;
    req.session.orderDate = orderDate;
    req.session.orderStatus = orderStatus;
    req.session.ordersQuantity = orderQuantity;
    req.session.orders = orderImage;
    req.session.favs = favouriteImage;
    req.session.favName = favName;
    req.session.names = eyesNames;
    req.session.image = eyesImage;
    req.session.quantity = eyesQuantity;
    req.session.price = eyesPrice;
    req.session.pid = eyesPid;
    req.session.brand = eyesBrand;
    res.status(200).redirect('/home');
}

app.post('/createFav', createFav);
function createFav (req, _res)
{
    model.addToFavs(req.session.username,req.session.pid[0]);
    console.log("added..");
}


/****************************************************************/

app.get('/register',(req,res)=>
{
    res.render('register',{session:req.session});
})
app.post('/signUpUser', signUpUser);
function signUpUser (req, res)
{
    console.log("Trying to log in with: "+req.body.username);
    if(session.loggedin)
    {
        res.status(401).send("You are already logged in");
    }
    else
    {
        if(model.doesExist(req.body.username,req.body.email))
        {   
            alert("This username or email already exists.");
        }
        else
        {   
            var ccid = idk(req,res);
            ccid = ccid + 1;
            ccid = 'CC' + ccid;
            model.help(req.body.username,req.body.password,req.body.email,ccid);
            createSession(req, res);
        }
    }
}
function idk(_req,_res){
    return temp.length;
}

/****************************************************************/
app.get('/eyes',(req,res)=>{
    favouritePid = [];
    favouriteImage = [];
    favName = [];
    console.log("eyes");
    model.addToFavs();
    favPid.push('P1');
    favPid.sort();
    favUser.push('user1');
    favUser.sort();

    console.log(favUser);
    console.log(favPid);

    var z = 0;
    for(i = 0; i < favUser.length; i++)
    {
        if (favUser[i] == req.session.username)
        {
            favouritePid[z] = favPid[i];
            z++;
        }
    }

    console.log(favouritePid);

    var zr = 0;
    for(i = 0; i < productImage.length; i++)
    {
        if (favouritePid[zr] == productPid[i])
        {
            favName[zr] = productNames[i];
            favouriteImage[zr] = productImage[i];
            zr++;
        }
    }

    favouriteImage[2] = 'IMG_4755.jpg';
    favName[2] = 'flower highlighter';

    req.session.favs = favouriteImage;
    req.session.favName = favName;

    res.render('eyes',{session:req.session});
})

app.post('/myAccount', myAccount);
function myAccount (req, res)
{
    createSession(req, res);
    // favouriteImage = req.session.favs;
    // favouriteImage.push(productImage[0]);
    // req.session.favs = favouriteImage;

    // favName = req.session.favName;
    // favName.push(productNames[0]);
    // req.session.favName = favName;
}


/************************  handling checkout  ***************************/

// app.get('/checkout',(req,res)=>
// {
//     res.render('checkout',{session:req.session});
// })
// app.post('/payment', payment);
// function payment (req, res)
// {
//     sql = `SELECT ccid FROM user
//            WHERE username = `+ session.username;

//     db.get(sql, (err, row) => {
//         if (err) {
//             throw err;
//         }
//         if (row == null){
//             var credit = "CC" + (i+1)
//             var queue = `UPDATE user
//                          SET ccid = ` + credit
//                          `WHERE username = `+ session.username;
            
//             db.run(queue, (err) => {
//                 if(err) return;
//             });

//             model.checkout(req.body.name, req.body.cardNum, req.body.exp, req.body.cvv, credit);
//         }
//     });

// }

/***************************  adding to cart  *************************************/

// app.post('/addToBag', bag);
// function bag (req, res)
// {
//     sql = `INSERT INTO shoppingBag
//            VALUES (`+session.username +`,` + ;

//     db.get(sql, (err, row) => {
//         if (err) {
//             throw err;
//         }
//         if (row == null){
//             var credit = "CC" + (i+1)
//             var queue = `UPDATE user
//                          SET ccid = ` + credit
//                          `WHERE username = `+ session.username;
            
//             db.run(queue, (err) => {
//                 if(err) return;
//             });

//             model.checkout(req.body.name, req.body.cardNum, req.body.exp, req.body.cvv, credit);
//         }
//     });

// }

/*************************************************************** */
var server = app.listen(3000);

// HTTP Keep-Alive to a short time to allow graceful shutdown
server.on('connection', function (socket) {
    socket.setTimeout(4 * 1000);
});

// close the database connection
db.close((err) => {
    if (err) {
      return console.error(err.message);
    }
    console.log('Close the database connection.');
});


console.log("Server listening at http://localhost:3000")

