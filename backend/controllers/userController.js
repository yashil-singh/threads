import mongoose from "mongoose";
import User from "../database/models/users.js";

export const getUser = async (req, res) => {
  try {
    const { query } = req.query;

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
