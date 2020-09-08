var express = require("express"),
    router = express.Router(),
    passport = require('passport'),
    User = require("../models/user");

//home page
router.get("/",function(req, res){
    res.render("landing")
});

//show register form
router.get("/register", function(req, res){
    res.render("register");
});
//handle sign up logic
router.post("/register", function(req, res){
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            req.flash("error", err.message);
            res.render("register")
        }   
        passport.authenticate("local")(req, res, function(){
            req.flash("success", "Welcome to YelpCamp "+user.username);
            res.redirect("/campgrounds")
        })
    })
});

//show login form
router.get("/login", function(req, res){
    res.render("login");
});
//handle login logic
router.post("/login", passport.authenticate("local", 
    {
    successRedirect: "/campgrounds",
    failureRedirect: "/login"
    }), function(req, res){
});

//handle logout
router.get("/logout", function(req, res){
    req.logOut();
    req.flash("success", "Logged out!")
    res.redirect("/");
});

//handle login status
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next()}
    res.redirect("/login");
}

module.exports = router;