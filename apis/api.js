require("dotenv").config();
const express = require("express");
const router = express.Router();
const Food = require("../models/food");
const Order = require("../models/orders");
const Review = require("../models/review");
const jwt = require("jsonwebtoken");
const verifyToken = require("../middlewares/verifyToken");
const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production" ? true : false,
  sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
};
// Food API
//For getting all the foodItems
router.get("/foods", async (req, res) => {
  const page = parseInt(req.query.page);
  const itemsPerPage = parseInt(req.query.itemsPerPage);
  const skip = (page - 1) * itemsPerPage;
  const allFoods = await Food.find({}).skip(skip).limit(itemsPerPage);
  const totalProducts = await Food.estimatedDocumentCount();
  res.status(200).send({ totalProducts: totalProducts, foods: allFoods });
});

//For getting top food section's data

router.get("/top-foods", async (req, res) => {
  try {
    const topFoods = await Food.find({ count: { $gt: 500 } }).limit(6);
    res.send(topFoods);
  } catch (err) {
    console.error(err);
  }
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

router.get("/my-added-items", verifyToken, async (req, res) => {
  try {
    if (req.user.email !== req.query.email) {
      return res.status(403).send({ message: "Forbidden Access" });
    }
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
    const updateFoodItem = await Food.find(
      { _id: id },
      "foodImage price foodCategory foodName",
    );
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

router.get("/my-orders", verifyToken, async (req, res) => {
  try {
    if (req.user.email !== req.query.email) {
      return res.status(403).send({ message: "Forbidden Access" });
    }
    const { email } = req.query;
    const myOrders = await Order.find(
      { email: email },
      "foodName foodImage price time date _id quantity",
    );
    res.status(200).send(myOrders);
  } catch (err) {
    console.error(err);
  }
});

//For food order
router.post("/orders", async (req, res) => {
  const { order, id, quantity, email, time, date } = req.body;
  const orderFromFoodColl = await Food.findById(id);
  if (orderFromFoodColl.quantity == 0) {
    return res
      .status(200)
      .send({ message: "Sorry this food is not available", status: false });
  }

  if (quantity > orderFromFoodColl.quantity) {
    return res.status(200).send({
      message: "Can't order more than available quantity",
      status: false,
    });
  }
  // Just to increase the quantity of order
  const isTheFoodExistsInOrderDB = await Order.find({
    foodName: order.foodName,
  });
  if (isTheFoodExistsInOrderDB.length !== 0) {
    const integerValueOfOrderQuantity = parseInt(quantity);
    await Order.findOneAndUpdate(
      { foodName: order.foodName },
      { $inc: { quantity: integerValueOfOrderQuantity } },
    );
    await Food.findByIdAndUpdate(id, {
      $inc: { count: 1, quantity: -integerValueOfOrderQuantity },
    });
    return res
      .status(200)
      .send({ message: "Successfully Orderd", status: true });
  }
  // To create a new Order
  const newOrder = new Order({
    foodName: order.foodName,
    foodImage: order.foodImage,
    email: email,
    price: order.price,
    quantity: quantity,
    date: date,
    time: time,
  });
  await newOrder.save();
  const integerValueOfOrderQuantity = parseInt(quantity);
  await Food.findByIdAndUpdate(id, {
    $inc: { count: 1, quantity: -integerValueOfOrderQuantity },
  });
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

// Review API

// To get the Reviews of users

router.get("/reviews", async (req, res) => {
  try {
    const reviews = await Review.find({});
    res.status(200).send(reviews);
  } catch (err) {
    console.error(err);
  }
});

// To post a review in DB
router.post("/reviews", async (req, res) => {
  try {
    const { name, feedback, imageURL } = req.body;
    const newReview = new Review({
      name: name,
      feedback: feedback,
      imageURL: imageURL,
    });
    await newReview.save();
    res.status(200).send({ message: "Thank you for your feedback" });
  } catch (err) {
    console.error(err);
  }
});

// JWT APIs

router.post("/jwt", async (req, res) => {
  const { email } = req.body;
  const accessToken = jwt.sign(
    {
      email: email,
    },
    process.env.TOKEN_SECRET,
    { expiresIn: "1h" },
  );
  res.cookie("accessToken", accessToken, cookieOptions).send({ success: true });
});

router.post("/logout", async (req, res) => {
  res
    .clearCookie("accessToken", { ...cookieOptions, maxAge: 0 })
    .send({ success: true });
});

module.exports = router;
