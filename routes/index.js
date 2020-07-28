var express = require("express");
var router = express.Router();

var passport = require("passport");
var User = require("../models/user");

//ROOT
router.get("/", function(req,res){
    res.render("landing");
});



//===================
//Auth Routes
//===================

//show register form
router.get("/register", function(req,res){
    res.render("register", {page: "register"});
});

//handle sign up logic
router.post("/register", function(req,res){
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, addedUser){
        if(err){
            req.flash("error", err.message);
            res.redirect("/register");
        }else{
            passport.authenticate("local")(req, res, function(){
                req.flash("success", "Welcome to Park-Review, "+addedUser.username+"!");
                res.redirect("/parks");
            });
        }
    });
});

//show login form
router.get("/login", function(req,res){
    res.render("login", {page: "login"});
});


//handling login logic
router.post("/login", passport.authenticate("local",
    {
        successRedirect: "/parks",
        failureRedirect: "/login",
        failureFlash: true,
        successFlash: "Welcome to Park-Review!"
    }), function(req,res){
    //do ntg
});

//logout logic
router.get("/logout", function(req,res){
    req.logout();
    req.flash("success", "Logged Out!");
    res.redirect("/parks");
});

module.exports = router;