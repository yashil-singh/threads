import mongoose from "mongoose";

const replySchema = new mongoose.Schema(
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
  {
    timestamps: true, // Enable timestamps for replies
  }
);

const postSchema = new mongoose.Schema(
  {
    content: {
      type: String,
    },
    media: [
      {
        mediaUrl: {
          type: String,
        },
        type: {
          type: String,
        },
      },
    ],
    replies: [replySchema],
    likes: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "User",
      default: [],
    },
    reposts: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "User",
      default: [],
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
