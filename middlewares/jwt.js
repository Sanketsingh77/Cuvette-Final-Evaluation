import User from "../models/user.js";
import jwt from "jsonwebtoken";

export const protect = async (req, res, next) => {
  try {
    // finding token
    const token = await req.cookies.token;
    if (!token) {
      return res.status(403).json({ message: "Token not found!" });
    }

    // verifying token
    const isTokenVerified = jwt.verify(token, process.env.JWT_SECRET);

    // get user from token
    const user = await User.findById(isTokenVerified.id).select("-password");

    if (!user) {
      res.status(404).json({ message: "User not found!" });
    } else {
      req.user = user;
      next();
    }
  } catch (error) {
    res.status(403).json({ message: "Not authenticated!" });
  }
};
