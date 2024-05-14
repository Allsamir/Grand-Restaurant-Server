const mongoose = require("mongoose");

const reviewSchema = mongoose.Schema({
  name: String,
  feedback: String,
  imageURL: String,
});

const Review = new mongoose.model("Review", reviewSchema);

module.exports = Review;
