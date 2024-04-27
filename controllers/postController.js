import Post from "../models/post.js";
import createError from "../utils/createError.js";
import mongoose from "mongoose";

export const createPost = async (req, res, next) => {
  try {
    const user = req.user;

    const { post, category } = req.body;
    if (!post || !category)
      return next(createError(400, "All fields are required!"));

    const newPost = await Post({
      post,
      category,
      userId: user._id,
    });

    await newPost.save();

    res.status(201).json({ message: "Post created successfully!" });
  } catch (error) {
    next(error);
  }
};

export const getPosts = async (req, res, next) => {
  try {
    const posts = await Post.find();

    res.status(200).json(posts);
  } catch (error) {
    next(error);
  }
};

export const getPostById = async (req, res, next) => {
  try {
    const postId = req.params.postId;

    const post = await Post.findById(postId);
    if (!post) return next(createError(404, "Post not found!"));

    res.status(200).json(post);
  } catch (error) {
    next(error);
  }
};

export const getPostsByCategory = async (req, res, next) => {
  try {
    const category = req.params.category;
    if (category == "all") {
      const posts = await Post.find();
      return res.status(200).json(posts);
    }

    const posts = await Post.find({ category: category.toLowerCase() });

    res.status(200).json(posts);
  } catch (error) {
    next(error);
  }
};

export const updatePost = async (req, res, next) => {
  try {
    const postId = req.params.postId; // post to update

    const realPost = await Post.findById(postId);
    const user = req.user;

    if (realPost.userId.toString() === user._id.toString()) {
      const { post, category } = req.body;
      if (!post || !category)
        return next(createError(400, "All fields are required!"));

      await realPost.updateOne({ $set: req.body });
      return res.status(200).json({ message: "Post updated successfully!" });
    } else {
      res.status(403).json({ message: "Action forbidden!" });
    }
  } catch (error) {
    next(error);
  }
};
