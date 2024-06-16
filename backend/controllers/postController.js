import Post from "../database/models/posts.js";
import Notification from "../database/models/notifications.js";
import { v2 as cloudinary } from "cloudinary";
import User from "../database/models/users.js";
import { getRecipientSocketId, io } from "../socket/socket.js";

export const getPosts = async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });

    res.success({ data: posts });
  } catch (error) {
    res.error({ error, status: 500 });
  }
};

export const getPostById = async (req, res) => {
  try {
    const postId = req.params.id;

    if (!postId) return res.error({ message: "Invalid request." });

    const post = await Post.findById(postId);

    if (!post) return res.error({ message: "Post not found.", status: 404 });

    res.success({ data: post });
  } catch (error) {
    res.error({ status: 500, error });
  }
};

export const getPostByUserId = async (req, res) => {
  try {
    const userId = req.params.userId;

    if (!userId) return res.error({ message: "Invalid request." });

    const user = await User.findById(userId);

    if (!user) return res.error({ message: "User not found.", status: 404 });

    const post = await Post.find({ userId }).sort({ createdAt: -1 });

    res.success({ data: post });
  } catch (error) {
    console.log("🚀 ~ error:", error);

    res.error({ status: 500, error });
  }
};

export const createPost = async (req, res) => {
  try {
    const { content, images } = req.body;

    const userId = req.user._id;

    const media = [];

    if (images) {
      const uploadPromises = images.map(async (image) => {
        const uploadedResponse = await cloudinary.uploader.upload(image, {
          resource_type: "auto",
        });
        console.log("🚀 ~ uploadedResponse:", uploadedResponse);

        const mediaUrl = uploadedResponse.secure_url;
        const type = uploadedResponse.resource_type;
        media.push({ mediaUrl, type });
      });

      // Wait for all upload promises to resolve
      await Promise.all(uploadPromises);
    }

    if (!content && media.length < 1)
      return res.error({ message: "Some content is required." });

    const newPost = new Post({
      content,
      userId,
      media,
    });

    await newPost.save();

    res.success({ message: "Thread posted successfully." });
  } catch (error) {
    res.error({ error, status: 500 });
  }
};

export const deletePost = async (req, res) => {
  try {
    const postId = req.params.postId;

    if (!postId) return res.error({ message: "Invalid request." });

    const deletedPost = await Post.findByIdAndDelete(postId);

    if (!deletedPost) return res.error({ message: "Post not found." });

    const media = deletedPost?.media;

    media.map(async (m) => {
      await cloudinary.uploader.destroy(
        m.mediaUrl.split("/").pop().split(".")[0]
      );
    });

    res.success({ message: "Post deleted successfully." });
  } catch (error) {
    console.log("🚀 ~ error:", error);

    res.error({ error, status: 500 });
  }
};

export const toggleLike = async (req, res) => {
  try {
    const userId = req.user._id;
    const postId = req.params.id;

    if (!postId) return res.error({ message: "Invalid request." });

    const post = await Post.findById(postId);

    if (!post) return res.error({ status: 404, message: "Post not found." });

    const liked = post.likes.includes(userId);

    if (liked) {
      await Post.findByIdAndUpdate(postId, {
        $pull: { likes: userId },
      });

      await Notification.findOneAndDelete({
        recipientId: post.userId,
        userId,
        postId,
        message: `${req.user.username} liked your post.`,
      });
    } else {
      await Post.findByIdAndUpdate(postId, {
        $push: { likes: userId },
      });

      if (userId.toString() !== post.userId.toString()) {
        const recipientSocketId = getRecipientSocketId(post.userId);

        if (recipientSocketId) {
          const username = req.user.username;
          const message = `${username} liked your post.`;

          const notification = new Notification({
            recipientId: post.userId,
            userId,
            profilePic: req.user.profilePic,
            message,
            content: post.content,
            postId,
            thumbnail: post.media[0],
          });
          await notification.save();

          io.to(recipientSocketId).emit("receiveNotification", notification);
        }
      }
    }

    res.success({ message: liked ? "Like removed." : "Post liked." });
  } catch (error) {
    console.log("🚀 ~ error:", error);

    res.error({ status: 500, error });
  }
};

export const toggleRepost = async (req, res) => {
  try {
    const userId = req.user._id;
    const postId = req.params.id;

    if (!postId) return res.error({ message: "Invalid request." });

    const post = await Post.findById(postId);

    if (!post) return res.error({ status: 404, message: "Post not found." });

    const reposted = post.reposts.includes(userId);

    if (reposted) {
      await Post.findByIdAndUpdate(postId, {
        $pull: { reposts: userId },
      });
      await User.findByIdAndUpdate(userId, {
        $pull: { reposts: postId },
      });
    } else {
      await Post.findByIdAndUpdate(postId, {
        $push: { reposts: userId },
      });
      await User.findByIdAndUpdate(userId, {
        $push: { reposts: postId },
      });
    }

    res.success({ message: reposted ? "Repost removed." : "Reposted." });
  } catch (error) {
    res.error({ status: 500, error });
  }
};
