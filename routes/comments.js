var express = require("express");
var router = express.Router();

var Park = require("../models/park");
var Comment = require("../models/comment");

//===================
//Comment Routes
//===================

//NEW ROUTE FOR COMMENT
router.get("/parks/:id/comments/new", isLoggedIn, function(req,res){
    //find Park by ID
    Park.findById(req.params.id, function(err, foundPark){
        if(err || !foundPark){
            req.flash("error", "Park not found");
            res.redirect("/parks");
        }else{
            res.render("comments/new", {park: foundPark});
        }
    });
    
});

//CREATE ROUTE FOR COMMMENT
router.post("/parks/:id/comments", isLoggedIn, function(req,res){
    //find park using id
    Park.findById(req.params.id, function(err, foundPark){
        if(err){
            req.flash("error", "Park not found");
            res.redirect("/parks");
        }else{
            //create new comment
            Comment.create(req.body.comment, function(err, comment){
                if(err){
                    req.flash("error", "Comment not created");
                    res.redirect("/parks");
                }else{
                    //add username and id to comment
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    //save comment
                    comment.save();
                    //connect comment with park
                    foundPark.comments.push(comment);
                    foundPark.save();
                    //redirect to show page of the park
                    req.flash("success", "Succesfully added comment");
                    res.redirect("/parks/"+req.params.id);
                }
            });
        }
    });
});

//EDIT ROUTE FOR COMMENT
router.get("/parks/:id/comments/:comment_id/edit", checkCommentOwnership, function(req,res){
    var parkID = req.params.id;

    Park.findById(req.params.id, function(err, foundPark){
        if(err || !foundPark){
            req.flash("error","Park not found");
            res.redirect("back");
        }else{
            Comment.findById(req.params.comment_id, function(err, foundComment){
                if(err){
                    req.flash("error", "Comment not found");
                    res.redirect("back");
                }else{            
                res.render("comments/edit", {park_id: parkID, comment: foundComment});
                }
            });
        }
    });    
});

//UPDATE ROUTE FOR COMMENT
router.put("/parks/:id/comments/:comment_id", checkCommentOwnership, function(req,res){
    //update the time edited to now
    req.body.comment.createdAt = Date.now();
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
        if(err){
            req.flash("error", "Comment not found");
            res.redirect("back");
        }else{
            req.flash("success", "Successfully editted comment");
            res.redirect("/parks/"+req.params.id);
        }
    });
});

//DELETE ROUTE FOR COMMENT
router.delete("/parks/:id/comments/:comment_id", checkCommentOwnership, function(req,res){
    Comment.findByIdAndDelete(req.params.comment_id, function(err){
        if(err){
            req.flash("error", "Comment not found");
            res.redirect("back");
        }else{
            req.flash("error", "Successfully deleted comment");
            res.redirect("/parks/"+req.params.id);
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

//middleware for comment
function checkCommentOwnership(req,res,next){
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, foundComment){
            if(err || !foundComment){
                req.flash("error", "Comment not found");
                res.redirect("back");
            }else{
                if(foundComment.author.id.equals(req.user._id)){
                    next();
                }else{
                    req.flash("error", "You don't have permission to do that");
                    res.redirect("back");
                }
            }
        });
    }else{
        req.flash("error", "You need to be logged in to do that");
        res.redirect("/login");
    }
}


module.exports = router;