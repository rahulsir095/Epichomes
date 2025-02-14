const { types } = require("joi");
const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
   comment: String,
   rating: {
      type: Number,
      min: 1,
      max: 5,
   },
   author: {
      type: mongoose.Schema.Types.ObjectId,
      ref:"User"
   },
   createdAt: {
      type: Date,
      default: Date.now(),
   },
});

const Review = mongoose.model("Review", reviewSchema);

module.exports = Review;
