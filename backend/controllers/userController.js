import mongoose from "mongoose";
import User from "../database/models/users.js";
import { v2 as cloudinary } from "cloudinary";
import { getRecipientSocketId, io } from "../socket/socket.js";
import Notification from "../database/models/notifications.js";

// GET Requets
export const getUser = async (req, res) => {
  try {
    const query = req.params.query;

    if (!query) return res.error({ message: "Invalid request.", status: 400 });

    let user;

    if (mongoose.Types.ObjectId.isValid(query)) {
      user = await User.findOne({ _id: query })
        .select("-password")
        .select("-updatedAt");
    } else {
      user = await User.findOne({
        username: query,
      })
        .select("-password")
        .select("-updatedAt");
    }

    if (!user) return res.error({ message: "Account not found." });

    res.success({ data: user });
  } catch (error) {
    console.log("🚀 ~ getUser user Controller:", error);

    res.error({ error: error, status: 500 });
  }
};

export const getFollowers = async (req, res) => {
  try {
    const currentUserId = req.user._id;

    const currentUser = await User.findById(currentUserId);

    if (!currentUser)
      return res.error({ status: 404, message: "Account not found." });

    const followers = currentUser.followers;

    res.success({ data: followers });
  } catch (error) {
    console.log("🚀 ~ error userController:", error);
    res.error({ status: 500, error });
  }
};

export const getFollowersById = async (req, res) => {
  try {
    const userId = req.params.id;

    if (!userId) return res.error({ message: "Invalid request." });

    const user = await User.findById(userId).populate(
      "followers",
      "_id name username profilePic isPrivate followers following requestReceived requestSent"
    );

    if (!user) return res.error({ status: 404, message: "Account not found." });

    const followers = user?.followers;

    res.success({ data: followers });
  } catch (error) {
    console.log("🚀 ~ error userController:", error);
    res.error({ status: 500, error });
  }
};

export const getFollowing = async (req, res) => {
  try {
    const currentUserId = req.user._id;
    const currentUser = await User.findById(currentUserId);

    if (!currentUser)
      return res.error({ status: 404, message: "Account not found." });

    const following = currentUser.following;

    res.success({ data: following });
  } catch (error) {
    console.log("🚀 ~ error userController:", error);
    res.error({ status: 500, error });
  }
};

export const getFollowingById = async (req, res) => {
  try {
    const userId = req.params.id;

    if (!userId) return res.error({ message: "Invalid request." });

    const user = await User.findById(userId).populate(
      "following",
      "_id name username profilePic isPrivate followers following requestReceived requestSent"
    );

    if (!user) return res.error({ status: 404, message: "Account not found." });

    const following = user?.following;

    res.success({ data: following });
  } catch (error) {
    console.log("🚀 ~ error userController:", error);
    res.error({ status: 500, error });
  }
};

export const getFollowRequests = async (req, res) => {
  try {
    const currentUserId = req.user._id;

    const user = await User.findById(currentUserId).select("-password");

    if (!user) return res.error({ status: 404, message: "Account not found." });

    const requests = user.requestReceived;

    res.success({ data: requests });
  } catch (error) {
    console.log("🚀 ~ getFollowRequests userController:", error);
    res.error({ status: 500, error });
  }
};

export const getSuggestedUsers = async (req, res) => {
  try {
    const userId = req.user._id;

    const userFollows = await User.findById(userId).select("following");

    const users = await User.aggregate([
      {
        // To filter
        $match: {
          _id: { $ne: userId }, // Condition (ne = not equal)
        },
      },
      {
        $sample: { size: 10 }, // Random selection
      },
      {
        $project: {
          password: 0, // 0 means exclude
        },
      },
    ]);

    // Filtering out user followings
    const filteredUsers = users.filter(
      (user) => !userFollows.following.includes(user._id)
    );

    res.success({ data: filteredUsers });
  } catch (error) {
    console.log("🚀 ~ suggested user userController:", error);

    res.error({ error, status: 500 });
  }
};

export const searchProfile = async (req, res) => {
  try {
    const query = req.query.query;

    // Create a regular expression for case-insensitive, partial match
    const regex = new RegExp(query, "i");

    const users = await User.find({
      $or: [{ username: { $regex: regex } }, { name: { $regex: regex } }],
    }).select("_id name username profilePic");

    res.success({ data: users });
  } catch (error) {
    return res.error({ error, status: 500 });
  }
};

// POST Requests
export const toggleFollow = async (req, res) => {
  try {
    const userId = req.params?.id;
    const currentUserId = req.user._id.toString();

    const recipientSocketId = getRecipientSocketId(userId);

    if (!userId)
      return res.error({
        message: "Invalid request. The user to modify is required.",
      });

    if (currentUserId === userId)
      return res.error({
        message: "Invalid request. You cannot follow yourself.",
      });
    const userToInteract = await User.findById(userId);

    const currentUser = await User.findById(currentUserId);

    if (!userToInteract || !currentUser)
      return res.error({ message: "Account not found.", status: 404 });

    const isFollowing = currentUser.following.includes(userId);

    let message;

    if (isFollowing) {
      // Unfollow
      await User.findByIdAndUpdate(userId, {
        $pull: { followers: currentUserId },
      });
      await User.findByIdAndUpdate(currentUserId, {
        $pull: { following: userId },
      });

      message = "Account Unfollowed.";

      await Notification.findOneAndDelete({
        recipientId: userToInteract._id,
        userId: currentUser._id,
        message: `${req.user.username} followed you.`,
      });
    } else {
      if (userToInteract.isPrivate) {
        const isRequested =
          userToInteract.requestReceived.includes(currentUserId);

        // Toggle follow request
        if (isRequested) {
          await User.findByIdAndUpdate(userId, {
            $pull: { requestReceived: currentUserId },
          });
          await User.findByIdAndUpdate(currentUserId, {
            $pull: { requestSent: userId },
          });

          message = "Follow request removed";
        } else {
          await User.findByIdAndUpdate(userId, {
            $push: { requestReceived: currentUserId },
          });
          await User.findByIdAndUpdate(currentUserId, {
            $push: { requestSent: userId },
          });

          message = "Follow request sent.";
        }
      } else {
        // Follow
        await User.findByIdAndUpdate(userId, {
          $push: { followers: currentUserId },
        });
        await User.findByIdAndUpdate(currentUserId, {
          $push: { following: userId },
        });

        message = "Account Followed.";

        const newNotification = new Notification({
          message: `${req.user.username} followed you.`,
          recipientId: userToInteract._id,
          profilePic: currentUser.profilePic,
          userId: currentUser._id,
        });

        await newNotification.save();

        if (recipientSocketId) {
          io.to(recipientSocketId).emit("receiveNotification", newNotification);
        }
      }
    }

    const user = await User.findById(currentUserId)
      .select("following")
      .select("requestSent");
    res.success({ data: user, message });
  } catch (error) {
    console.log("🚀 ~ userInteractivity userController:", error);
    res.error({ error: error, status: 500 });
  }
};

export const toggleRequest = async (req, res) => {
  try {
    const action = req.query.action;

    const userId = req.params.id;
    const currentUserId = req.user._id.toString();

    if (currentUserId === userId)
      return res.error({
        message: "Invalid request. You cannot follow yourself.",
      });

    if (!action || !userId)
      return res.error({
        message: "Invalid request. User or action not found.",
      });

    if (action !== "accept" && action !== "remove")
      return res.error({ message: "Invalid request. Action not found" });

    if (!mongoose.Types.ObjectId.isValid(userId))
      return res.error({ status: 404, message: "Account not found." });

    const userToInteract = await User.findById(userId).select("-password");
    const currentUser = await User.findById(currentUserId).select("-password");

    if (!userToInteract || !currentUser)
      return res.error({ status: 404, message: "Account not found." });

    const isFollowing = currentUser.followers.includes(userId);

    if (isFollowing)
      return res.error({ message: "Account is already a follower." });

    const isRequested = currentUser.requestReceived.includes(userId);

    let message;

    if (isRequested) {
      await User.findByIdAndUpdate(userId, {
        $pull: { requestSent: currentUserId },
      });
      await User.findByIdAndUpdate(currentUserId, {
        $pull: { requestReceived: userId },
      });

      message = "Request removed.";

      if (action === "accept") {
        await User.findByIdAndUpdate(currentUserId, {
          $push: { followers: userId },
        });
        await User.findByIdAndUpdate(userId, {
          $push: { following: currentUserId },
        });

        message = "Request accepted.";
      }

      const user = await User.findById(currentUserId).select("requestReceived");

      res.success({ data: user, message });
    } else {
      res.error({
        message: "Invalid request. Follow request was not received.",
      });
    }
  } catch (error) {
    console.log("🚀 ~ toggleRequest userController:", error);
    res.error({ status: 500, error });
  }
};

// PUT Requests
export const updateUser = async (req, res) => {
  try {
    const { name, username, bio, isPrivate } = req.body;

    let { profilePic } = req.body;

    const userId = req.user?._id.toString();

    // Find current user
    let user = await User.findById(userId).select("-password");
    if (!user) return res.error({ message: "Account not found." });

    // Username Check
    const userByUsername = await User.findOne({ username });

    if (userByUsername && userId !== userByUsername?._id.toString())
      return res.error({
        message: "Username is already taken.",
      });

    // Handle Profile Pic
    if (profilePic && !profilePic.includes("https://res.cloudinary.com")) {
      if (user.profilePic) {
        await cloudinary.uploader.destroy(
          user.profilePic.split("/").pop().split(".")[0]
        );
      }

      const uploadedResponse = await cloudinary.uploader.upload(profilePic);
      profilePic = uploadedResponse.secure_url;
    }

    if (user.isPrivate && !isPrivate) {
      // If profile was private and changed to public, accept all requests
      const pendingRequests = user.requestReceived;

      // Move all pending requests to the followers array
      user.followers = [...user.followers, ...pendingRequests];

      // Clear the requestReceived array
      user.requestReceived = [];

      // You may want to update the following list of the users who sent requests
      await User.updateMany(
        { _id: { $in: pendingRequests } },
        { $push: { following: user._id } }
      );
    }

    // Update User Fields
    user.name = name || user.name;
    user.username = username || user.username;
    user.profilePic = profilePic || user.profilePic;
    user.bio = bio || user.bio;
    user.isPrivate = isPrivate;

    user = await user.save();

    res.success({ message: "Profile updated successfully.", data: user });
  } catch (error) {
    console.log("🚀 ~ updateUser userController: ", error);

    res.error({ status: 500, error: error });
  }
};

export const freezeAccount = async (req, res) => {
  try {
    const userId = req.user?._id;

    const user = await User.findById(userId);

    if (!user) return res.error({ message: "Account not found.", status: 404 });

    user.isFrozen = true;
    await user.save();
    res.success({ message: "Account freezed successfully." });
  } catch (error) {
    console.log("🚀 ~ freezeAccount userController: ", error);

    res.error({ status: 500, error: error });
  }
};

// DELETE Requests
export const removeFollower = async (req, res) => {
  try {
    const userId = req.params.id;
    const currentUserId = req.user._id.toString();

    if (!userId)
      return res.error({
        message: "Invalid request. Account to remove is required.",
      });

    if (!mongoose.Types.ObjectId.isValid(userId))
      return res.error({ status: 404, message: "Account not found." });

    const userToInteract = User.findById(userId).select("-password");
    const currentUser = await User.findById(currentUserId).select("-password");

    if (!userToInteract || !currentUser)
      return res.error({ status: 404, message: "Account not found." });

    const isFollowing = currentUser.followers.includes(userId);

    if (!isFollowing)
      return res.error({
        message: "Invalid request. Account is not following you.",
      });

    // Remove from current user
    await User.findByIdAndUpdate(currentUserId, {
      $pull: { followers: userId },
    });

    // Remove from the follower
    await User.findByIdAndUpdate(userId, {
      $pull: { following: currentUserId },
    });

    const user = await User.findById(currentUserId).select("followers");
    res.success({ data: user, message: "Follower removed." });
  } catch (error) {
    console.log("🚀 ~ removeFollower userController:", error);
    res.error({ error, status: 500 });
  }
};

export const deleteAccount = async (req, res) => {
  try {
    const currentUserId = req.user._id.toString();

    await User.findOneAndDelete(currentUserId);

    res.success({ message: "Account deleted successfully.", data: null });
  } catch (error) {
    res.error({ status: 500, error });
  }
};
