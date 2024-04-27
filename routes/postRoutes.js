import express from "express";
const router = express.Router();
import {
  createPost,
  getPostById,
  getPosts,
  getPostsByCategory,
  updatePost,
} from "../controllers/postController.js";
import { protect } from "../middlewares/jwt.js";

router.post("/", protect, createPost);

router.get("/", getPosts);

router.get("/:postId", getPostById);

router.get("/cat/:category", getPostsByCategory);

router.put("/:postId", protect, updatePost);

export default router;
