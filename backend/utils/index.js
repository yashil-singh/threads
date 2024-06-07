import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";

export const hashPassword = async (password) => {
  try {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
  } catch (error) {
    console.log("🚀 ~ hashpassword error:", error);
    return null;
  }
};

export const generateRandomString = (length) => {
  return crypto
    .randomBytes(length)
    .toString("base64")
    .replace(/[^a-zA-Z0-9]/g, "")
    .substring(0, length);
};

export const verifyPassword = async ({ currentPassword, password }) => {
  if (!currentPassword || !password) return false;
  return await bcrypt.compare(password, currentPassword);
};

export const setCookieToken = async ({ userId, res }) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRECT, {
    expiresIn: "15d",
  });

  res.cookie("token", token, {
    httpOnly: true,
    maxAge: 15 * 24 * 60 * 60 * 1000, // 15 days
    sameSite: "strict",
  });
};
