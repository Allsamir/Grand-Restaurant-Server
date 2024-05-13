const mongoose = require("mongoose");

const orderSchema = mongoose.Schema({
  foodName: String,
  foodImage: String,
  email: String,
  price: Number,
  quantity: Number,
  date: String,
  time: String,
});

const Orders = new mongoose.model("Order", orderSchema);

module.exports = Orders;
