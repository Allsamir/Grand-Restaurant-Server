require("dotenv").config();
const express = require("express");
const router = express.Router();
const Food = require("../models/food");

router.get("/foods", async (req, res) => {
  const allFoods = await Food.find({});
  res.status(200).send(allFoods);
});

router.get("/foodName", async (req, res) => {
  const { name } = req.query;
  const item = await Food.findOne({ foodName: name });
  res.send(item);
});

router.get("/singleFood", async (req, res) => {
  const { id } = req.query;
  const singleFoodItem = await Food.findById(id);
  res.send(singleFoodItem);
});

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
  res.status(200).send(result);
});

module.exports = router;
