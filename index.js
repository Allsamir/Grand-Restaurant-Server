require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const api = require("./apis/api");
const app = express();
const port = process.env.PORT || 3000;

app.use(
  cors({
    origin: ["http://localhost:5173", "https://grand-resturant-01.web.app"],
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());
mongoose
  .connect(process.env.DATABASE_URL)
  .then(() => console.log("Database connected"))
  .catch((err) => console.error(err));

app.use(api);

app.get("/", (req, res) => {
  res.send("Hello From Grand Resturant");
});
app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
