import mongoose from "mongoose";

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required."],
    },
    username: {
      type: String,
      required: [true, "Username is required."],
      unique: true,
      minlength: [5, "Username must be at least 5 characters long."],
    },
    email: {
      type: String,
      required: [true, "Email address is required."],
      unique: true,
    },
    password: {
      type: String,
      minLength: 6,
      required: [true, "Password is required."],
    },
    profilePic: {
      type: String,
      default: "",
    },
    followers: {
      type: [String],
      default: [],
    },
    following: {
      type: [String],
      default: [],
    },
    requestSent: {
      type: [String],
      default: [],
    },
    requestReceived: {
      type: [String],
      default: [],
    },
    bio: {
      type: String,
      default: "",
    },
    isPrivate: {
      type: Boolean,
      default: false,
    },
    isFrozen: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("findOneAndDelete", async function (next) {
  const userId = this.getQuery()["_id"];

  try {
    // Delete user-related references in other collections
    await Promise.all([
      mongoose
        .model("User")
        .updateMany({ followers: userId }, { $pull: { followers: userId } }),
      mongoose
        .model("User")
        .updateMany({ following: userId }, { $pull: { following: userId } }),
      mongoose
        .model("User")
        .updateMany(
          { requestSent: userId },
          { $pull: { requestSent: userId } }
        ),
      mongoose
        .model("User")
        .updateMany(
          { requestReceived: userId },
          { $pull: { requestReceived: userId } }
        ),
      // mongoose.model("Post").deleteMany({ user: userId }),
      // mongoose
      //   .model("Post")
      //   .updateMany(
      //     { "replies.user": userId },
      //     { $pull: { replies: { user: userId } } }
      //   ),
    ]);

    next();
  } catch (error) {
    console.error("Error in cascade delete middleware:", error);
    next(error);
  }
});

const User = mongoose.model("User", userSchema);

export default User;
