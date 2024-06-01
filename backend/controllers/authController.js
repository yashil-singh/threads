import User from "../database/models/users.js";
import {
  hashPassword,
  setCookieToken,
  verifyPassword,
} from "../utils/index.js";

export const signup = async (req, res) => {
  try {
    const { name, email, username, password } = req.body;

    const userByEmail = await User.findOne({ email });

    if (userByEmail)
      return res.error({
        message: "An account with that email already exists.",
      });

    const userByUsername = await User.findOne({ username });

    if (userByUsername)
      return res.error({ message: "Username is already taken." });

    const hashedPassword = await hashPassword(password);

    const newUser = new User({
      name,
      email,
      password,
      username,
      password: hashedPassword,
    });

    await newUser.save();

    if (newUser) {
      const data = await User.findById(newUser._id)
        .select("-password")
        .select("-updatedAt");
      res.success({
        data: data,
        message: "Account created successfully.",
        status: 201,
      });
    } else {
      res.error(400, "Invalid request.");
    }
  } catch (error) {
    console.log("🚀 ~ signup controller:", error?.name);
    res.error({ error: error, status: 500 });
  }
};

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({
      $or: [{ email: username }, { username: username }],
    });

    if (!user)
      return res.error({
        message: "Account not found.",
        status: 400,
      });

    const validPassword = await verifyPassword({
      password,
      currentPassword: user?.password,
    });

    if (!validPassword) return res.error({ message: "Invalid credentials." });

    if (user.isFrozen) {
      user.isFrozen = false;
      await user.save();
    }

    const data = await User.findById(user._id)
      .select("-password")
      .select("-updatedAt");

    setCookieToken({ userId: user?._id, res });

    res.success({ data, message: "Logged in successfully." });
  } catch (error) {
    console.log("🚀 ~ login authController:", error);
    res.error({ error: error, status: 500 });
  }
};

export const logout = async (req, res) => {
  try {
    res.cookie("token", "", {
      httpOnly: true,
      maxAge: 0, // Expire the cookie immediately
      sameSite: "strict",
    });

    res.success({ message: "Logged out successfully." });
  } catch (error) {
    console.log("🚀 ~ logout auth Controller:", error);
    res.error({ error: error, status: 500 });
  }
};
