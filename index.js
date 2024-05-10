require("dotenv").config();
const express = require("express");
const cors = require("cors");
const api = require("./apis/api");
const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(api);
app.get("/", (req, res) => {
  res.send("Hello From Grand Resturant");
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
