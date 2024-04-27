import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    post: [
      {
        heading: { type: String, required: true },
        description: { type: String, required: true },
        imgUrl: { type: String, required: true },
        category: { type: String, required: true },
      },
    ],
    category: {
      type: String,
      required: true,
    },
    likes: {
      type: [],
    },
  },
  {
    timestamps: true,
  }
);

const Post = mongoose.model("Post", postSchema);
export default Post;
