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

//For Currentuser's added food items

router.get("/my-added-items", async (req, res) => {
  try {
    const { email } = req.query;
    const result = await Food.find(
      { email: email },
      "foodName foodImage price foodCategory _id",
    );
    res.status(200).send(result);
  } catch (err) {
    console.error(err);
  }
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
  await newFoodData.save();
  res.status(200).send({ message: "Successfully Added" });
});

// For updateding the Food Item

router.patch("/updateFood", async (req, res) => {
  try {
    const { id } = req.query;
    let { foodName, price, foodCategory, foodImage } = req.body;
    const updateFoodItem = await Food.find({ _id: id });
    console.log(updateFoodItem);
    if (foodImage === "") {
      foodImage = updateFoodItem.foodImage;
    }
    if (price === "") {
      price = updateFoodItem.price;
    }
    if (foodCategory === "") {
      foodCategory = updateFoodItem.foodCategory;
    }
    if (foodName === "") {
      foodName = updateFoodItem.foodName;
    }
    await Food.findByIdAndUpdate(id, {
      foodName: foodName,
      price: price,
      foodCategory: foodCategory,
      foodImage: foodImage,
    });
    res.status(200).send({ message: "Updated Successfully" });
  } catch (err) {
    console.error(err);
  }
});

// For deleting Food

router.delete("/deleteFood", async (req, res) => {
  try {
    const { id } = req.query;
    await Food.findByIdAndDelete(id);
    res.status(200).send({ message: "Successfully Deleted" });
  } catch (err) {
    console.error(err);
  }
});

// Orders API
// For currentUser's orders list

router.get("/my-orders", async (req, res) => {
  try {
    const { email } = req.query;
    const myOrders = await Order.find(
      { email: email },
      "foodName foodImage price time date _id ",
    );
    res.status(200).send(myOrders);
  } catch (err) {
    console.error(err);
  }
});

//For food order
router.post("/orders", async (req, res) => {
  const { order, id, foodImage } = req.body;
  const orderFromFoodColl = await Food.findById(id);
  if (orderFromFoodColl.quantity == 0) {
    return res
      .status(200)
      .send({ message: "Sorry this food is not available", status: false });
  }

  if (order.quantity > orderFromFoodColl.quantity) {
    return res.status(200).send({
      message: "Can't order more than available quantity",
      status: false,
    });
  }
  const integerValueOfOrderQuantity = parseInt(order.quantity);
  await Food.findByIdAndUpdate(id, {
    $inc: { count: 1, quantity: -integerValueOfOrderQuantity },
  });
  const newOrder = new Order({
    foodName: order.foodName,
    foodCategory: order.foodCategory,
    foodOrigin: order.foodOrigin,
    foodImage: foodImage,
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

// For deleting order of currentUser

router.delete("/deleteOrder", async (req, res) => {
  try {
    const { id } = req.query;
    await Order.findByIdAndDelete(id);
    res.status(200).send({ message: "Your order has been deleted" });
  } catch (err) {
    console.error(err);
  }
});

module.exports = router;
