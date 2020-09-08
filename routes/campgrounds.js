var express = require("express")
var router = express.Router({mergeParams: true});

var Campground = require("../models/campground"),
    middleware = require("../middleware");

//list all campgrounds
router.get("/", function(req, res){
    //trazer dados do DB
    Campground.find({}, function(err, allCampgrounds){
        if (err) { 
            console.log(err)
        } else {
            res.render("campgrounds/index", {campgrounds:allCampgrounds, currentUser: req.user});
        }
    })
});

//CREATE//post new campground
router.post("/", middleware.isLoggedIn, function(req, res){
    //receber dados do formulario
    var name = req.body.name;
    var image = req.body.image;
    var description = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    var newCampground = {name: name, image: image, description: description, author: author};
    //criar novo dado e salvar na db
    Campground.create(newCampground, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            console.log(newlyCreated);
            req.flash("success", "Campground Successfully Created!");
            res.redirect("/campgrounds");
        }
    })
});

//NEW//show new campground form
router.get("/new", middleware.isLoggedIn, function(req, res){
    res.render("campgrounds/new");
})

//SHOW//show selected campground
router.get("/:id", function(req, res){
    //achar o campground com tal ID
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err){
            console.log(err)
        } else {
            //render template com aquele ID
    res.render("campgrounds/show", {campground: foundCampground});
        }
    })   
});

//EDIT
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res) {
    Campground.findById(req.params.id, function(err, foundCampground){
        if(err){
            req.flash("error", "This campground doesn't exist!");
            res.redirect("back");
        } else {
            res.render("campgrounds/edit", {campground: foundCampground});
        }
    });
});

//UPDATE
router.put("/:id", middleware.checkCampgroundOwnership, function(req, res){
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
        if(err){
            req.flash("error", "Error while updation campground, try again.");
            res.redirect("/campgrounds");
        } else {
            req.flash("success", "Campground Updated!");
            res.redirect("/campgrounds/"+req.params.id);
        }
    })
});

//DESTROY
router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res){
    Campground.findByIdAndDelete(req.params.id, function(err){
        if(err){
            res.redirect("/campgrounds")
        } else {
            req.flash("error", "Campground Deleted.");
            res.redirect("/campgrounds")
        }
    })
});

module.exports = router;