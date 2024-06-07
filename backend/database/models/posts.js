import mongoose from "mongoose";

const postSchema = mongoose.Schema(
  {
    content: {
      type: String,
    },
    media: [
      {
        mediaUrl: {
          type: String,
        },
      },
    ],
    replies: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        content: {
          type: String,
          required: true,
        },
        userProfilePic: {
          type: String,
        },
        username: {
          type: String,
        },
      },
    ],
    likes: {
      type: Number,
      default: 0,
    },
    reposts: {
      type: Number,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "The profile that posted is required."],
    },
  },
  {
    timestamps: true,
  }
);

const Post = mongoose.model("Post", postSchema);

export default Post;
