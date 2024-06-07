import User from "../database/models/users.js";
import {
  generateRandomString,
  hashPassword,
  setCookieToken,
  verifyPassword,
} from "../utils/index.js";
import dotenv from "dotenv";
import sendMail from "../utils/mailer.js";

dotenv.config();

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
      maxAge: 1, // Expire the cookie immediately
      sameSite: "strict",
    });

    res.cookie("connect.sid", "", {
      maxAge: 1,
    });

    res.user = null;

    res.success({ message: "Logged out successfully." });
  } catch (error) {
    console.log("🚀 ~ logout auth Controller:", error);
    res.error({ error: error, status: 500 });
  }
};

export const checkSession = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");

    if (!user) {
      return res.error({ message: "User not found" });
    }

    res.success({ data: user, message: "Session restored." });
  } catch (error) {
    res.error({ error, status: 500 });
  }
};

export const google = async (req, res) => {
  try {
    const googleProfile = req.user;

    const existingUser = await User.findOne({
      email: googleProfile.emails[0].value,
    });

    if (existingUser) {
      if (existingUser.isFrozen) {
        existingUser.isFrozen = false;
        await existingUser.save();
      }
      setCookieToken({ userId: existingUser?._id, res });

      res.redirect(process.env.CLIENT_URL);
    } else {
      req.user = googleProfile;
      res.redirect(`${process.env.CLIENT_URL}google-signup/username`);
    }
  } catch (error) {
    console.log("🚀 ~ error from google:", error);

    res.error({ status: 500, error });
  }
};

export const googleSuccess = async (req, res) => {
  try {
    const googleProfile = req.user;
    console.log("🚀 ~ googleProfile:", googleProfile);

    if (!googleProfile)
      return res.error({ status: 403, message: "Unauthorized" });

    const username = req.params.username;
    console.log("🚀 ~ username:", username);

    if (!username)
      return res.error({
        message: "Username is required and must be at least 5 characters.",
      });

    const existingUser = await User.findOne({ username: username });
    console.log("🚀 ~ existingUser:", existingUser);

    if (existingUser) {
      return res.error({ message: "Username is already taken." });
    }

    const name =
      googleProfile?.name.givenName + " " + googleProfile?.name.familyName;
    const email = googleProfile?.emails[0].value;

    if (!name || !email)
      return res.error({ status: 403, message: "Unauthorized" });

    const password = generateRandomString(10);
    const hashedPassword = await hashPassword(password);

    const newUser = new User({
      name,
      email,
      password,
      username,
      password: hashedPassword,
    });

    await newUser.save();

    setCookieToken({ userId: newUser?._id, res });

    const to = email;
    const html = `<!DOCTYPE html>
<html>
<head>
  <style>
    .container {
      width: 100%;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }
    .header {
      padding: 10px;
      text-align: center;
    }
    .content {
      margin: 20px 0;
    }
    .footer {
      padding: 10px;
      text-align: center;
      font-size: 12px;
    }
    .password-container {
      background-color: #f7f7f7;
      padding: 15px;
      border-radius: 16px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Welcome to Threads</h1>
    </div>
    <div class="content">
      <p>Dear ${name.split(" ")[0]},</p>
      <p>Thank you for signing up to Threads. We are thrilled to have you on board.</p>
      <div class="password-container">
        <p>Here is your password:</p>
        <h1>${password}</h1>
      </div>
      <p>Best regards,<br>Threads Team</p>
    </div>
    <div class="footer">
      <p>&copy; 2024 Our Service. All rights reserved.</p>
    </div>
  </div>
</body>
</html>`;
    const subject = "Welcome to Threads!";

    sendMail({ to, html, subject });

    res.success({ message: "Account created successfully." });
  } catch (error) {
    console.log("🚀 ~ error:", error);

    return res.error({ error, status: 500 });
  }
};

export const googleFail = async (req, res) => {
  console.log("🚀 ~ req:", req);
};
