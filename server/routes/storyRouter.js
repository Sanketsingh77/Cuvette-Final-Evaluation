const express = require("express");
const Story = require("../models/storyModel");
const User = require("../models/UserModel");
const jwt = require("jsonwebtoken");
const storyRouter = express.Router();
const tokenVerification = require("../middlewares/verifyToken");
const { handleErrorResponse } = require("../utils/handleError");
const Joi = require("joi");
const storySchemaValidation = Joi.object({
  createdAt: Joi.date(),
  lastUpdatedAt: Joi.date().default(null),
  slides: Joi.array()
    .min(3)
    .items(
      Joi.object({
        category: Joi.string().required(),
        title: Joi.string().required(),
        description: Joi.string().required(),
        imageURL: Joi.string().required(),
      })
    ),
});
storyRouter.get("/story-by-category", async (req, res) => {
  try {
    const { category, page } = req.query;
    const categoryRegex = new RegExp(category, "i");
    const query = {
      "slides.category": categoryRegex,
    };
    const totalStories = await Story.countDocuments(query);
    const stories = await Story.find(query).limit(page * 4);
    const storiesRemainanig = totalStories - page * 4;

    let storiesWithEditAccess = stories.map((story) => ({
      ...story.toObject(),
    }));
    const token = req.headers.token;
    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      if (!decoded || !decoded.userID) {
        return res.status(401).send("Invalid token");
      }
      const user = await User.findById(decoded.userID);
      storiesWithEditAccess = stories.map((story) => {
        const editable = story.ownedBy.toString() === user._id.toString();
        const bookmarked = story.bookmarks.includes(user._id.toString());
        const liked = story.likes.includes(user._id.toString());
        return {
          ...story.toObject(),
          editable: editable,
          bookmarked: bookmarked,
          liked: liked,
        };
      });
    }

    res.json({
      stories: storiesWithEditAccess,
      remainingStories: Math.max(storiesRemainanig, 0),
    });
  } catch (error) {
    handleErrorResponse(res, error);
  }
});
storyRouter.post("/add", tokenVerification, async (req, res) => {
  try {
    const story = await storySchemaValidation.validateAsync(req.body);
    const newStory = new Story({
      ...story,
      ownedBy: req.userID,
    });
    await newStory.save();
    return res.status(201).json({
      message: "success",
    });
  } catch (error) {
    handleErrorResponse(res, error);
  }
});
storyRouter.patch("/update/:id", tokenVerification, async (req, res) => {
  try {
    const { id } = req.params;
    const { userID } = req;
    const storyData = await storySchemaValidation.validateAsync(req.body);
    const storyToUpdate = await Story.findById(id);

    if (!storyToUpdate) {
      return res.status(404).json({ message: "Story not found" });
    }
    if (storyToUpdate.ownedBy.toString() !== userID) {
      return res
        .status(403)
        .json({ message: "Unauthorized to update this story" });
    }
    storyToUpdate.slides = storyData.slides;
    storyToUpdate.lastUpdatedAt = new Date();
    await storyToUpdate.save();
    res.json({ message: "success" });
  } catch (error) {
    handleErrorResponse(res, error);
  }
});
storyRouter.get("/share-story/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const story = await Story.findById(id);
    res.status(200).json({
      story: story,
    });
  } catch (error) {
    handleErrorResponse(res, error);
  }
});
storyRouter.get("/get-story/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const token = req.headers.token;

    const story = await Story.findById(id);
    if (!story) {
      return res.status(404).send("Story not found");
    }

    if (!token) {
      const storyDataWithoutAccess = {
        ...story.toObject(),
        liked: false,
        bookmarked: false,
      };
      return res.status(200).json(storyDataWithoutAccess);
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded || !decoded.userID) {
      return res.status(401).send("Invalid token");
    }

    const user = await User.findById(decoded.userID);
    if (!user) {
      return res.status(404).send("User not found");
    }

    const bookmarked = story.bookmarks.includes(user._id.toString());
    const liked = story.likes.includes(user._id.toString());

    const storyWithAccessData = {
      ...story.toObject(),
      bookmarked: bookmarked,
      liked: liked,
    };

    res.status(200).json(storyWithAccessData);
  } catch (error) {
    handleErrorResponse(res, error);
  }
});

storyRouter.put("/like/:id", tokenVerification, async (req, res) => {
  try {
    const storyId = req.params.id;
    const userId = req.userID;
    const story = await Story.findById(storyId);
    if (!story) {
      return res.status(404).json({ message: "Story not found" });
    }
    if (story.likes.includes(userId)) {
      const userIndex = story.likes.indexOf(userId);
      story.likes.splice(userIndex, 1);
      await story.save();

      return res.json({ message: "Like removed successfully" });
    } else {
      story.likes.push(userId);
      await story.save();
      return res.json({ message: "Story liked successfully" });
    }
  } catch (error) {
    handleErrorResponse(res, error);
  }
});

storyRouter.put("/bookmark/:id", tokenVerification, async (req, res) => {
  try {
    const storyId = req.params.id;
    const userId = req.userID;
    const story = await Story.findById(storyId);
    if (!story) {
      return res.status(404).json({ message: "Story not found" });
    }
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (story.bookmarks.includes(userId)) {
      const storyIndex = story.bookmarks.indexOf(userId);
      story.bookmarks.splice(storyIndex, 1);
      await story.save();

      const userIndex = user.bookmarks.indexOf(storyId);
      user.bookmarks.splice(userIndex, 1);
      await user.save();

      return res.json({ message: "Bookmark removed" });
    } else {
      story.bookmarks.push(userId);
      await story.save();

      user.bookmarks.push(storyId);
      await user.save();

      return res.json({ message: "Story bookmarked successfully" });
    }
  } catch (error) {
    handleErrorResponse(res, error);
  }
});
storyRouter.get("/my-bookmarks", tokenVerification, async (req, res) => {
  try {
    const user = await User.findById(req.userID);
    const bookmarkIds = user.bookmarks;
    const bookmarkedStories = await Promise.all(
      bookmarkIds.map(async (id) => {
        return await Story.findById(id);
      })
    );
    res.status(200).json({ stories: bookmarkedStories });
  } catch (error) {
    handleErrorResponse(res, error);
  }
});

storyRouter.get("/my-stories", tokenVerification, async (req, res) => {
  try {
    const page = req.query.page || 1;
    const query = {
      ownedBy: req.userID,
    };
    const myStories = await Story.find(query).limit(page * 4);
    const totalStories = await Story.countDocuments(query);
    const storiesRemainanig = totalStories - page * 4;
    const storiesWithEditAccess = myStories.map((story) => {
      return {
        ...story.toObject(),
        editable: true,
      };
    });
    return res.status(200).json({
      stories: storiesWithEditAccess,
      remainingStories: storiesRemainanig,
    });
  } catch (error) {
    handleErrorResponse(res, error);
  }
});
module.exports = storyRouter;
