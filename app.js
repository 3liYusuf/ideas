require('dotenv').config();
const express = require("express");
const ejs = require("ejs");
const app = express();
const mongoose = require("mongoose");
const { log } = require("console");
const encrypt = require('mongoose-encryption');
const md5 = require("md5");
const bcrypt = require("bcrypt");
const saltRounds = 10;
var session = require('express-session');
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(express.urlencoded({extended:true}));

app.use(session({
    secret: "Our little secret.",
    resave: false,
    saveUninitialized: false,
}))

app.use(passport.initialize());
app.use(passport.session());

mongoose.set('strictQuery', false);
mongoose.connect("mongodb://127.0.0.1:27017/userDB", {useNewUrlParser:true});

const userSchema = new mongoose.Schema({
    email:String,
    password:String
});

userSchema.plugin(passportLocalMongoose);

const User = mongoose.model("User", userSchema);

passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.get("/", function(req,res){
    res.render("home");
})

app.get("/login", function(req,res){
    res.render("login");
})

app.get("/register", function(req,res){
    res.render("register");
})

app.get("/secrets", function(req,res){
    if(req.isAuthenticated()){
        res.render("secrets");
    }else{
        res.redirect("/login");
    }
})

app.get("/logout", function(req,res){
    req.logout(function(err) {
        if (err) {
            log(err);
        }
        res.redirect('/');
      });
})

app.post('/register',function(req,res){

    User.register({username:req.body.username}, req.body.password, function(err,user){
        if(err){
            log(err);
            res.redirect("/register");
        }else{
            passport.authenticate("local")(req,res,function(){
                res.redirect("/secrets");
            })
        }
    })

    // bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
    //     const newUser = new User({
    //         email: req.body.username,
    //         password: hash
    //     });
    //     newUser.save(function(err){
    //         if(err){
    //             log(err);
    //         }else{
    //             res.render("secrets");
    //         }
    //     })
    // });
})

app.post("/login",function(req,res){
    const username = req.body.username;
    const password = req.body.password;

    const user = new User({
        username: username,
        password: password
    });

    req.login(user, function(err){
        if(err){
            log(err);
        }else{
            passport.authenticate("local")(req,res,function(){
                res.redirect("/secrets");
            })
        }
    })
    // User.findOne({email:username}, function(err,foundUser){
    //     if(err){
    //         log(err);
    //     }else{
    //         if(foundUser){
    //             bcrypt.compare(password, foundUser.password, function(err, result) {
    //                 console.log(result);
    //                 if(result == true){
    //                     res.render("secrets")
    //                 }
    //             });
    //         }
    //     }
    // })
})





app.listen(3000,function(){
    console.log("Server started on port 3000")
})