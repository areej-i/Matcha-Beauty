const express = require('express');
const app = express();
const fs = require('fs');
const model = require('./businessLogic.js')
const path = require('path');
const pug = require('pug');
const sqlite3 = require('sqlite3').verbose();

app.use(express.json());
app.set('views',path.join(__dirname,'views'));
app.set('public',path.join(__dirname,'public'));
app.set('view engine','pug');
app.use(express.urlencoded({extended:true}));

//Create session
const session = require('express-session');

app.use(session({ 
    cookie:{ maxAge: 1000000000},
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
app.get('/bestselling',(req,res)=>
{
    res.render('bestselling',{session:req.session});
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
            req.session.username = req.body.username;
            req.session.loggedin = true;
            res.status(200).redirect('/home');
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
    res.redirect('/');
})

/**********************  Handling Log in  *************************/

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
            req.session.username = req.body.username;
            req.session.loggedin = true;
            res.status(200).redirect('/home',{session:req.session});
        }
    }
}
function idk(_req,_res){
    return temp.length;
}

/****************************************************************/
app.get('/all',(req,res)=>{
    let productAmount = [];

    for (let b = 0; b < productNames.length; b++){
        productAmount[b] = b;
    } 

    res.render('all',{session:req.session,image:productImage,name:productNames,brand:productBrand,quantity:productQuantity,price:productPrice,pid:productPid,amount:productAmount});
})

app.get('/eyes',(req,res)=>{
    let eyesImage = [];
    let eyesNames = [];
    let eyesBrand = [];
    let eyesPid = [];
    let eyesQuantity = [];
    let eyesPrice = [];
    let eyesAmount = [];


    let b = 0;
    for (let u in productCategory){
        if (productCategory[u] == "eyes"){
            eyesImage[b] = productImage[u];
            eyesNames[b] = productNames[u];
            eyesBrand[b] = productBrand[u];
            eyesPid[b] = productPid[u];
            eyesQuantity[b] = productQuantity[u];
            eyesPrice[b] = productPrice[u];
            eyesAmount[b] = b;
            b++;
        }
    }  

    res.render('eyes',{session:req.session,image:eyesImage,name:eyesNames,brand:eyesBrand,quantity:eyesQuantity,price:eyesPrice,pid:eyesPid,amount:eyesAmount});
})

app.get('/lips',(req,res)=>{

    let lipsImage = [];
    let lipsNames = [];
    let lipsBrand = [];
    let lipsPid = [];
    let lipsQuantity = [];
    let lipsPrice = [];
    let lipsAmount = [];

    let b = 0;
    for (let u in productCategory){
        if (productCategory[u] == "lips"){
            lipsImage[b] = productImage[u];
            lipsNames[b] = productNames[u];
            lipsBrand[b] = productBrand[u];
            lipsPid[b] = productPid[u];
            lipsQuantity[b] = productQuantity[u];
            lipsPrice[b] = productPrice[u];
            lipsAmount[b] = b;
            b++;
        }
    }  

    res.render('lips',{session:req.session,image:lipsImage,name:lipsNames,brand:lipsBrand,quantity:lipsQuantity,price:lipsPrice,pid:lipsPid,amount:lipsAmount});
})

app.get('/face',(req,res)=>{

    let faceImage = [];
    let faceNames = [];
    let faceBrand = [];
    let facePid = [];
    let faceQuantity = [];
    let facePrice = [];
    let faceAmount = [];

    let b = 0;
    for (let u in productCategory){
        if (productCategory[u] == "face"){
            faceImage[b] = productImage[u];
            faceNames[b] = productNames[u];
            faceBrand[b] = productBrand[u];
            facePid[b] = productPid[u];
            faceQuantity[b] = productQuantity[u];
            facePrice[b] = productPrice[u];
            faceAmount[b] = b;
            b++;
        }
    }  

    res.render('face',{session:req.session,image:faceImage,name:faceNames,brand:faceBrand,quantity:faceQuantity,price:facePrice,pid:facePid,amount:faceAmount});
})
// app.get('/account',(req,res)=>
// {
//     res.render('account',{session:req.session});
// })
app.get('/account',(req,res)=>{
    let myFavPid = [];
    let favImage = [];
    let favNames = [];
    let favPrice = [];
    let myOrderPid = [];
    let myOrderDate = [];
    let myOrderImage = [];
    let myOrderQuantity = [];
    let myOrderStatus = [];
    let myOrderName = [];
    let orderAmount = [];
    let favAmount = [];
    let c = 0;
    let ccid;
    if(req.session.loggedin)
    {   
        for (let u in favUser){
            if (favUser[u] == session.username){
                myFavPid[c] = favPid[u];
                c++;
            }
        }  

        let d = 0;
        for (let w in myFavPid){
            let b = productPid.indexOf(myFavPid[w]);
            favImage[d] = productImage[b];
            favNames[d] = productNames[b];
            favPrice[d] = productPrice[b];
            favAmount[d] = d;
            d++;
        } 

        z = userName.indexOf(session.username);
        ccid = userCCid[z];


        let a = 0;
        for(let x in orderCcid){
            if (orderCcid[x] == ccid){
                myOrderPid[a] = orderPid[x];
                myOrderDate[a] = orderDate[x];
                myOrderQuantity[a] = orderQuantity[x];
                myOrderStatus[a] = orderStatus[x];
                orderAmount[a] = a;
                a++;
            }
        }

        let r = 0;
        for(let v in productImage){
            if (myOrderPid[r] == productPid[v]){
                myOrderName[r] = productNames[v];
                myOrderImage[r] = productImage[v]; //gets image for the specific orders
                r++;
            }
        }

        res.render('account',{session:req.session,favImage:favImage,favNames:favNames,favPrice:favPrice,orderImage:myOrderImage,
            orderName:myOrderName,orderStatus:myOrderStatus,orderQuantity:myOrderQuantity,date:myOrderDate,orderPid:myOrderPid,
            orderAmount:orderAmount, favAmount:favAmount});
    }
    else
    {
        res.render('login',{session:req.session});
    }
})


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
app.listen(3000);

// close the database connection
db.close((err) => {
    if (err) {
      return console.error(err.message);
    }
    console.log('Close the database connection.');
});


console.log("Server listening at http://localhost:3000")
