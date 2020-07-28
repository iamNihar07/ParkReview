var mongoose = require("mongoose");

//Schema Setup
var parkSchema = new mongoose.Schema({
    name: String,
    price: String, //allows us to preserve formatting
    image: String,
    description: String,
    location: String,
    lat: Number,
    lng: Number,
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
    },
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }
    ]
});

var Park = mongoose.model("Park", parkSchema);

module.exports = Park;