import User from "../models/user.js";
import createError from "../utils/createError.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Generate a token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1d" });
};

export const register = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    if (!username || !password)
      return next(createError(400, "All fields are required!"));

    if (username.length < 4) {
      return next(
        createError(400, "Username should be atleast 4 charaacters long.")
      );
    }
    if (password.length < 5) {
      return next(
        createError(400, "Password should be atleast 5 charaacters long.")
      );
    }

    const user = await User.findOne({ username });
    if (user)
      return next(createError(409, "User with this name already exists!"));

    const hashedPass = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      username,
      password: hashedPass,
    });

    const token = generateToken(newUser?._id);
    if (newUser) {
      const { password, ...details } = newUser._doc;
      res
        .cookie("token", token, {
          path: "/",
          httpOnly: true,
          expires: new Date(Date.now() + 1000 * 60 * 60 * 24), // 1 day
          sameSite: "none",
          secure: true,
        })
        .status(201)
        .json(details);
    } else {
      next(createError(400, "Invalid user data!"));
    }
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    if (!username || !password)
      return next(createError(400, "All fields are required!"));

    const user = await User.findOne({ username });
    if (!user) return next(createError(404, "Username not found!"));

    const isPassCorrect = await bcrypt.compare(password, user.password);

    const token = generateToken(user?._id);

    if (isPassCorrect) {
      res.cookie("token", token, {
        path: "/",
        httpOnly: true,
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24),
        sameSite: "none",
        secure: true,
      });
    }

    if (user && isPassCorrect) {
      const { password, ...details } = user._doc;
      res.status(200).json(details);
    } else {
      return next(createError(400, "Invalid credentials!"));
    }
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
    res.cookie("token", "", {
      path: "/",
      httpOnly: true,
      expires: new Date(0),
      sameSite: "none",
      secure: true,
    });

    res.status(200).json({ message: "Logged out successfully!" });
  } catch (error) {
    next(error);
  }
};
