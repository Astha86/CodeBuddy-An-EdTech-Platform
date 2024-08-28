const mongoose = require("mongoose");

const ratingAndReviews = new mongoose.Schema({

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },

    rating: {
        type: String,
        required: true,
        trim:true,
    },

    review: {
        type: String,
        trim:true,
        required: true,
    },
});

module.exports = mongoose.model["RatingAndReviews", ratingAndReviews];