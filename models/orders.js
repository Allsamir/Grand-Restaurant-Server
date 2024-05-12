const mongoose = require("mongoose");

const orderSchema = mongoose.Schema({
  foodName: String,
  foodCategory: String,
  foodOrigin: String,
  email: String,
  name: String,
  price: Number,
  quantity: Number,
  date: String,
  time: String,
});

const Orders = new mongoose.model("Order", orderSchema);

module.exports = Orders;
