var express = require("express");
var router = express.Router();
var NodeGeocoder = require('node-geocoder');
 
var options = {
  provider: 'google',
  httpAdapter: 'https',
  apiKey: process.env.GEOCODER_API_KEY,
  formatter: null
};
 
var geocoder = NodeGeocoder(options);

var Park = require("../models/park");

//=========================
// Park Routes
//=========================

//INDEX page - show all parks
router.get("/parks", function(req,res){
    if(req.query.search){
        const regex = new RegExp(escapeRegex(req.query.search), "gi");
        //get all parks from DB
        Park.find({name: regex}, function(err,allParks){
            if(err){
                req.flash("error", "Park not found");
                res.redirect("/parks");
            }else{
                if(allParks.length === 0){
                    req.flash("error", "No matching park found");
                    return res.redirect("/parks");
                }
                
                res.render("parks/index", {parks: allParks, currentUser: req.user, page: "parks"});
                //redudant to pass currentUser since we already have a function currUser in app.js to eliminate this need
            }
        }); 
    }else{
        //get all parks from DB
        Park.find({}, function(err,allParks){
            if(err){
                req.flash("error", "Park not found");
                res.redirect("/parks");
            }else{
                res.render("parks/index", {parks: allParks, currentUser: req.user, page: "parks"});
                //redudant to pass currentUser since we already have a function currUser in app.js to eliminate this need
            }
        }); 
    }
       
});

//CREATE route - add new park to DB
router.post("/parks", isLoggedIn, function(req,res){
    //get data from form
    var name = req.body.name;
    var price = req.body.price;
    var image = req.body.image;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    };

    geocoder.geocode(req.body.location, function (err, data) {
        if (err || !data.length) {
            //console.log(err);
          req.flash("error", "Invalid address");
          return res.redirect("back");
        }
        var lat = data[0].latitude;
        var lng = data[0].longitude;
        var location = data[0].formattedAddress;

        //add to parks array
        var newPark = {name: name, price: price, image: image, description: desc, author: author, location: location, lat: lat, lng: lng};
        //parks.push(newPark);

        //create and save new park to DB
        Park.create(newPark, function(err, newpark){
            if(err){
                req.flash("error", "Park not created");
                res.redirect("/parks");
            }else{
                //redirect to parks page
                req.flash("success", "Successfully added Park: "+newpark.name);
                res.redirect("/parks");
            }
        });
    });
});

//NEW route - display a form to add new park
router.get("/parks/new", isLoggedIn, function(req,res){
    res.render("parks/newPark");
});

//SHOW route - display one particular park
router.get("/parks/:id", function(req,res){
    //find the park with given id - req.params.id
    //populating the comments for every park since we used object Ids
    Park.findById(req.params.id).populate("comments").exec(function(err, foundPark){
        if(err || !foundPark){
            req.flash("error", "Park not found");
            res.redirect("/parks");
        }else{
            //show info on that id
            res.render("parks/show", {park: foundPark});
        }
    });    
});

//EDIT route - show edit form for one park
router.get("/parks/:id/edit", checkParkOwnership, function(req,res){
    Park.findById(req.params.id, function(err, foundPark){
        if(err || !foundPark){
            req.flash("error", "Park not found");
            res.redirect("/parks");
        }else{
            res.render("parks/edit", {park: foundPark});
        }
    });    
});

//UPDATE route - update park
router.put("/parks/:id", checkParkOwnership, function(req, res){
    //update the park createdAt field to now
    req.body.park.createdAt = Date.now();

    geocoder.geocode(req.body.location, function (err, data) {
      if (err || !data.length) {
        //console.log(err);
        req.flash("error", "Invalid address");
        return res.redirect("back");
      }
      req.body.park.lat = data[0].latitude;
      req.body.park.lng = data[0].longitude;
      req.body.park.location = data[0].formattedAddress;
        //find and update the park
      Park.findByIdAndUpdate(req.params.id, req.body.park, function(err, park){
          if(err){
              req.flash("error", "Park not found");
              res.redirect("/parks");
          } else {
              req.flash("success","Successfully updated the Park: "+req.body.park.name);
              res.redirect("/parks/" + req.params.id);
          }
      });
    });
});

//DESTROY route - delete a park
router.delete("/parks/:id", checkParkOwnership, function(req,res){
    Park.findByIdAndRemove(req.params.id, function(err){
        if(err){
            req.flash("error", "Park not found");
            res.redirect("/parks");
        }else{
            req.flash("error", "Successfully deleted park");
            res.redirect("/parks");
        }
    });
});

//middleware
function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    //else
    req.flash("error", "You need to be logged in to do that!");
    res.redirect("/login");
}

//middleware for parks
function checkParkOwnership(req,res,next){
    if(req.isAuthenticated()){
        Park.findById(req.params.id, function(err, foundPark){
            if(err || !foundPark){
                req.flash("error", "Park not found");
                res.redirect("back");
            }else{
                if(foundPark.author.id.equals(req.user._id)){
                    next();
                }else{
                    req.flash("error", "You don't have permission to do that");
                    res.redirect("back");
                }
            }
        });
    }else{
        req.flash("error", "You need to be logged in to do that!");
        res.redirect("/login");
    }
}

function escapeRegex(text){
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}

module.exports = router;