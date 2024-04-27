const express = require("express");
const authRouter = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/UserModel");
const Joi = require("joi");
const tokenVerification = require("../middlewares/verifyToken");
const { handleErrorResponse } = require("../utils/handleError");
const userValidation = Joi.object({
  username: Joi.string().required().label("Username"),
  password: Joi.string().required().label("Password"),
});
authRouter.post("/login", async (req, res) => {
  try {
    const { username, password } = await userValidation.validateAsync(req.body);
    const userExists = await User.findOne({
      username: username,
    });
    if (!userExists) {
      return res
        .status(200)
        .json({ message: "No account exists.Please register" });
    }
    const passwordMatch = await bcrypt.compare(password, userExists.password);
    if (!passwordMatch) {
      return res.status(200).json({ message: "Invalid Password" });
    }
    const token = jwt.sign({ userID: userExists._id }, process.env.JWT_SECRET);
    res.json({
      message: "success",
      token: token,
    });
  } catch (error) {
    handleErrorResponse(res, error);
  }
});

authRouter.post("/register", async (req, res) => {
  try {
    const { username, password } = await userValidation.validateAsync(req.body);
    const userExists = await User.findOne({ username: username });
    if (userExists) {
      return res.status(200).json({
        message:
          "Username already exists. Please login or try a different username.",
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username: username,
      password: hashedPassword,
    });
    const savedUser = await newUser.save();
    const token = await jwt.sign(
      { userID: savedUser._id },
      process.env.JWT_SECRET
    );
    res.status(200).json({
      message: "success",
      token: token,
    });
  } catch (error) {
    handleErrorResponse(res, error);
  }
});
authRouter.get("/userData", tokenVerification, async (req, res) => {
  try {
    const id = req?.userID;
    const currUser = await User.findById(id);
    if (!currUser) {
      return res.status(200).json({
        message: "User not found",
      });
    }
    return res.status(200).json({
      message: "logged",
      username: currUser.username,
    });
  } catch (error) {
    handleErrorResponse(res, error);
  }
});
module.exports = authRouter;
