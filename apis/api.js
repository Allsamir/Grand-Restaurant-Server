const express = require("express");
const router = express.Router();

router.get("/birds", (req, res) => {
  res.send("Birds home page");
});

module.exports = router;
