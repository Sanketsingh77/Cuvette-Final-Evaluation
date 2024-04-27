import User from "../models/user.js";
import Post from "../models/post.js";
import createError from "../utils/createError.js";

export const bookmarkPost = async (req, res, next) => {
  try {
    const user = req.user;
    const postId = req.params.postId;

    const post = await Post.findById(postId);
    if (!post) return next(createError(404, "Post not found!"));

    if (!user.bookmarks.includes(post._id)) {
      await user.updateOne({ $push: { bookmarks: post._id } });
      res.status(200).json("Added to bookmarks!");
    } else {
      await user.updateOne({ $pull: { bookmarks: post._id } });
      res.status(200).json("Removed from bookmarks!");
    }
  } catch (error) {
    next(error);
  }
};

export const getUserBookmarks = async (req, res, next) => {
  try {
    const user = req.user;

    try {
      const { bookmarks } = user;
      const a = [];
      for (let i = 0; i < bookmarks.length; i++) {
        const element = await bookmarks[i];
        const fetchdata = await Post.findById({ _id: element });
        a.push(fetchdata);
      }

      res.status(200).json(a);
    } catch (error) {
      next(error);
    }
  } catch (error) {
    next(error);
  }
};

export const likeUnlikePost = async (req, res, next) => {
  const postId = req.params.postId;

  const user = req.user;

  try {
    const post = await Post.findById(postId);

    if (!post.likes.includes(user._id)) {
      await post.updateOne({ $push: { likes: user._id } });
      await user.updateOne({ $push: { liked: post._id } });
      res.status(200).json("Post has been liked!");
    } else {
      await post.updateOne({ $pull: { likes: user._id } });
      await user.updateOne({ $pull: { liked: post._id } });
      res.status(200).json("Post has been disliked!");
    }
  } catch (error) {
    next(error);
  }
};

export const getUserStories = async (req, res, next) => {
  try {
    const user = req.user;
    const posts = await Post.find({ userId: user._id });

    res.status(200).json(posts);
  } catch (error) {
    next(error);
  }
};
