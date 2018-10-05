var express                 = require("express"),
    seedDB                  = require("./seeds"),
    flash                   = require("connect-flash"),
    mongoose                = require("mongoose"),
    bodyParser              = require("body-parser"),
    passport                = require("passport"),
    User                    = require("./models/user"),
    Comment                 = require("./models/comment"),
    Campground              = require("./models/campground"),
    LocalStrategy           = require("passport-local"),
    methodOverride          = require("method-override");


//requiring routes
var commentRoutes       = require("./routes/comments"),
    campgroundRoutes    = require("./routes/campgrounds"),
    indexRoutes         = require("./routes/index");
    

var app = express();
mongoose.connect("mongodb://localhost/yelp_camp", {useNewUrlParser: true});
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
app.set("view engine", "ejs");

// seedDB(); //seed the database

// PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "SwaeLee is super cute",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next) {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success=req.flash("success");
    next(); 
});

app.use("/", indexRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);
app.use("/campgrounds", campgroundRoutes);

app.listen(process.env.PORT, process.env.IP, function() {
    console.log("The YelpCamp server has started!!");
});