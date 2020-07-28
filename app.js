var express     = require("express"),
app             = express(),
bodyParser      = require("body-parser"),
mongoose        = require("mongoose"),
passport        = require("passport"),
LocalStrategy   = require("passport-local"),
expressSession  = require("express-session"),
methodOverride  = require("method-override"),
flash           = require("connect-flash");
momentJS        = require("moment");
Park            = require("./models/park"), //importing Park Schema Model
Comment         = require("./models/comment"),
User            = require("./models/user");

//requiring routes
var parkRoutes = require("./routes/parks"),
    commentRoutes    = require("./routes/comments"),
    indexRoutes      = require("./routes/index"); //contains auth routes
    

var url = process.env.DATABASEURL || "mongodb://localhost/park_review"; 
//process.env.DATABASEURL environment variable is set on heroku side
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false });
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine","ejs");
app.use(express.static(__dirname + "/public")); //__dirname gets the current directory name
app.use(methodOverride("_method"));
app.use(flash());

//PASSPORT Configuration
app.use(expressSession({
    secret: "The famous story of one missing diamond and its discovery", //use process.env variable
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//passing currentUser (either logged in or not) to all pages
//so as to not pass currentUser manually to every ejs template like park index.ejs
function currUser(req,res,next){
    res.locals.currentUser = req.user;
    res.locals.errorMessage = req.flash("error");
    res.locals.successMessage = req.flash("success");
    res.locals.page = "page";
    res.locals.moment = momentJS;
    next();
}
app.use(currUser);

//ROUTES
app.use(indexRoutes);
app.use(parkRoutes);
app.use(commentRoutes);


var port = process.env.PORT || 3000;

app.listen(port, process.env.IP, function(){
    console.log("ParkReview server has started");
});
