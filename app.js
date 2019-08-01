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
var users = {
    username: [],
    password: [],
    level: []
};

// READ FILES
fs.readFile('users.json','utf8',function (err,data) {
    if (err) {
        console.log(err);
    } else {
        users = JSON.parse(data);
    }
});

// HOME PAGE
app.get("/",function(req,res) {
    var json = JSON.stringify(users);
    fs.writeFile('users.json',json,'utf8',function(req,res) {
        console.log(json);
    });
    if (accessLevel === 0) res.render("login");
    else if (accessLevel === 1) res.render("cashier");
    else if (accessLevel === 2) res.render("supervisor");
    else if (accessLevel === 3) res.render("admin");
    else res.render("404");
});

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
