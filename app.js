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
var reports = {
    pelapor: [],
    laporan: []
};
// END OF VARIABLES

// READ FILES
fs.readFile('database/users.json','utf8',function (err,data) {
    if (err) {
        console.log(err);
    } else {
        users = JSON.parse(data);
    }
});
fs.readFile('database/reports.json','utf8',function (err,data) {
    if (err) {
        console.log(err);
    } else {
        reports = JSON.parse(data);
    }
});
// END OF READ FILES

// HOME PAGE
app.get("/",function(req,res) {
    var jsonUsers = JSON.stringify(users);
    fs.writeFile('database/users.json',jsonUsers,'utf8',function(req,res) {
        console.log(jsonUsers);
    });
    var jsonReports = JSON.stringify(reports);
    fs.writeFile('database/reports.json',jsonReports,'utf8',function(req,res) {
        console.log(jsonReports);
    });
    if (accessLevel === 0) res.render("login");
    else if (accessLevel === 1) res.render("cashier");
    else if (accessLevel === 2) res.render("supervisor");
    else if (accessLevel === 3) res.render("admin");
    else res.render("404");
});
// END OF HOME PAGE

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
// END OF LOGIN

// LOGOUT
app.get("/logout",function(req,res) {
    currentUser="";
    accessLevel=0;
    res.redirect("/");
});
// END OF LOGOUT

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
// END OF REGISTER

// LAPORAN
app.get("/lapor",function(req,res) {
    res.render("lapor");
});
app.post("/lapor",function(req,res) {
    reports.pelapor.push(req.body.pelapor);
    reports.laporan.push(req.body.laporan);
    res.redirect("/");
});
app.get("/lihat-laporan",function(req,res) {
    console.log(accessLevel);
    if (accessLevel >= 0) res.render("lihat-laporan",{reports:reports});
    else res.render("404");
});
// END OF LAPORAN

// WIPERS
app.get("/wipe-users",function(req,res) {
    users = {
        username: [],
        password: [],
        level: []
    };
    res.redirect("/");
});
// END OF WIPERS

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
