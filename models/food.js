const mongoose = require("mongoose");

const foodSchema = mongoose.Schema({
  foodName: String,
  foodCategory: String,
  foodOrigin: String,
  foodImage: String,
  email: String,
  name: String,
  price: Number,
  quantity: Number,
  short_description: String,
});

const Food = mongoose.model("Food", foodSchema);
module.exports = Food;
