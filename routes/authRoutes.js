import express from "express";
const router = express.Router();
import { login, logout, register } from "../controllers/authController.js";

router.post("/register", register);

router.post("/login", login);

router.get("/logout", logout);

export default router;
