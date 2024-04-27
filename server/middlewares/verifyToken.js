const jwt = require("jsonwebtoken");
const User = require("../models/UserModel");
module.exports = async (req, res, next) => {
  try {
    const token = req.headers.token;
    if (!token) {
      return res.status(400).send("Token not found");
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded || !decoded.userID) {
      return res.status(401).send("Invalid token");
    }
    const user = await User.findById(decoded.userID);
    if (!user) {
      return res.status(404).send("User not found");
    }
    req.userID = decoded.userID;
    req.userName = user.username;
    next();
  } catch (error) {
    console.error(error);
    return res.status(500).send("Authentication failed");
  }
};
