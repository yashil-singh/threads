import mongoose from "mongoose";
import User from "../database/models/users.js";

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

// POST Requests
export const toggleFollow = async (req, res) => {
  try {
    const userId = req.params?.id;
    const currentUserId = req.user._id.toString();

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

    const updatingUserId = req.query.id;

    // Validate the request
    if (!userId || updatingUserId !== userId)
      return res.error({ message: "Invalid request.", status: 401 });

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
    if (profilePic) {
      if (user.profilePic) {
        // delete previous pp
      }

      // upload pic and get url
    }

    // Update User Fields
    user.name = name || user.name;
    user.username = username || user.username;
    user.profilePic = profilePic || user.profilePic;
    user.bio = bio || user.bio;
    user.isPrivate = isPrivate || user.isPrivate;
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
