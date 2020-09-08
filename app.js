//REQUIREMENTS
const   express = require("express"),
        app = express(),
        passport = require("passport"),
        LocalStrategy = require("passport-local"),
        bodyParser = require("body-parser"),
        {render} = require("ejs"),
        mongoose = require("mongoose"),
        flash = require("connect-flash"),
        methodOverride = require("method-override"),
//models
        Campground = require("./models/campground"),
        Comment = require("./models/comment"),
        User = require("./models/user"),
//reset database
        seedDB = require("./seeds"),
//requiring routes
        commentRoutes = require("./routes/comments"),
        campgroundRoutes = require("./routes/campgrounds"),
        indexRoutes = require("./routes/index");

//DELETE AND ADD EXEMPLES
// seedDB();

//FLASH CONFIGURATION
app.use(flash());

//PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "Johnny é um senhor de respeito",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


//CONNECTIONS TO DB
mongoose.connect('mongodb+srv://mazzoq:ghouse89@cluster0.srlcb.mongodb.net/<dbname>?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to DB!'))
.catch(error => console.log(error.message));
 
//CONNECTIONS TO OTHER REQUIREMENTS
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"))
app.use(methodOverride("_method"));

//FIND CURRENT USER
app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
})

//NAVIGATION ROUTES
app.use("/", indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);

//PUT ONLINE
app.listen(3000, function(){
    console.log("Started!");
});