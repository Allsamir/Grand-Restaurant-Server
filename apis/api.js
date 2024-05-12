require("dotenv").config();
const express = require("express");
const router = express.Router();
const Food = require("../models/food");
const Order = require("../models/orders");
// Food API
//For getting all the foodItems
router.get("/foods", async (req, res) => {
  const allFoods = await Food.find({});
  res.status(200).send(allFoods);
});
// For search func in front-end
router.get("/foodName", async (req, res) => {
  const { name } = req.query;
  const item = await Food.findOne({ foodName: name });
  res.send(item);
});
// For display a singleFood item in front-end
router.get("/singleFood", async (req, res) => {
  const { id } = req.query;
  const singleFoodItem = await Food.findById(id);
  res.send(singleFoodItem);
});
// For creating a NewFood Item
router.post("/foods", async (req, res) => {
  const { foodData } = req.body;
  const newFoodData = new Food({
    foodName: foodData.foodName,
    foodCategory: foodData.foodCategory,
    foodOrigin: foodData.foodOrigin,
    foodImage: foodData.foodImage,
    email: foodData.email,
    name: foodData.name,
    price: foodData.price,
    quantity: foodData.quantity,
    short_description: foodData.short_description,
  });
  const result = await newFoodData.save();
  res.status(200).send({ message: "Successfully Added" });
});
// Orders API
router.post("/orders", async (req, res) => {
  const { order, id } = req.body;
  const orderFromFoodColl = await Food.findById(id);
  if (orderFromFoodColl.quantity == 0) {
    return res
      .status(200)
      .send({ message: "Sorry this item is not available now", status: false });
  }

  if (order.quantity > orderFromFoodColl.quantity) {
    return res
      .status(200)
      .send({
        message: "Can't order more than available quantity",
        status: false,
      });
  }

  await Food.findByIdAndUpdate(id, { $inc: { count: 1 } }, { new: true });
  const newOrder = new Order({
    foodName: order.foodName,
    foodCategory: order.foodCategory,
    foodOrigin: order.foodOrigin,
    email: order.email,
    name: order.name,
    price: order.price,
    quantity: order.quantity,
    date: order.date,
    time: order.time,
  });
  await newOrder.save();
  res.status(200).send({ message: "Successfully Orderd", status: true });
});
module.exports = router;
