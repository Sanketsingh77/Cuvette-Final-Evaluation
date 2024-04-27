import express from "express";
import {
  bookmarkPost,
  getUserBookmarks,
  getUserStories,
  likeUnlikePost,
} from "../controllers/userController.js";
import { protect } from "../middlewares/jwt.js";
const router = express.Router();

router.put("/:postId", protect, bookmarkPost);

router.get("/allbookmarks", protect, getUserBookmarks);

router.put("/likeUnlike/:postId", protect, likeUnlikePost);

router.get("/getMyStories", protect, getUserStories);

export default router;
