//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const fs = require("fs");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

// VARIABLES
var accessLevel = 0;
var currentUser = "";
var users = {
    username: [],
    password: [],
    level: []
};

// READ FILES
fs.readFile('database/users.json','utf8',function (err,data) {
    if (err) {
        console.log(err);
    } else {
        users = JSON.parse(data);
    }
});

// HOME PAGE
app.get("/",function(req,res) {
    var json = JSON.stringify(users);
    fs.writeFile('database/users.json',json,'utf8',function(req,res) {
        console.log(json);
    });
    if (accessLevel === 0) res.render("login");
    else if (accessLevel === 1) res.render("cashier");
    else if (accessLevel === 2) res.render("supervisor");
    else if (accessLevel === 3) res.render("admin");
    else res.render("404");
});

// LOGIN
app.post("/login",function(req,res) {
    for (var i=0;i<users.username.length;i++) {
        if (users.username[i] === req.body.username && users.password[i] === req.body.password) {
            currentUser = req.body.username;
            accessLevel = users.level[i];
            break;
        }
    }
    console.log(currentUser,accessLevel);
    res.redirect("/");
});

// LOGOUT
app.get("/logout",function(req,res) {
    currentUser="";
    accessLevel=0;
    res.redirect("/");
})

// REGISTER NEW USERS
app.get("/register",function(req,res) {
    res.render("register");
});

app.post("/register",function(req,res) {
    users.username.push(req.body.username);
    users.password.push(req.body.password);
    users.level.push(Number(req.body.level));
    res.redirect("/");
}); 

// REPORT 
app.post("/lapor",function(req,res) {
    res.render("lapor");
});

// WIPE DATABASE
app.get("/wipe",function(req,res) {
    users = {
        username: [],
        password: [],
        level: []
    };
    res.redirect("/");
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
