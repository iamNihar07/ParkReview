var mongoose = require("mongoose");

//create Comment schem
var commentSchema = new mongoose.Schema({
    text: String,
    createdAt: {
        type: Date,
        default: Date.now
    },
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    }
});

//create a model
var Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;