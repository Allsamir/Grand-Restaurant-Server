require("dotenv").config();
const jwt = require("jsonwebtoken");

const verifyToken = async (req, res, next) => {
  if (!req.cookies.accessToken) {
    return res.status(401).send({ message: "Unauthorized Access" });
  }
  const accessToken = req.cookies.accessToken;
  jwt.verify(accessToken, process.env.TOKEN_SECRET, function (err, decoded) {
    if (err) {
      return res.status(401).send({ message: "Unauthorized Access" });
    }
    req.user = decoded;
    next();
  });
};
module.exports = verifyToken;
