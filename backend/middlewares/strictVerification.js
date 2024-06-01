import User from "../database/models/users.js";
import jwt from "jsonwebtoken";

const strictVerifcation = async (req, res, next) => {
  try {
    const token = req.cookies?.token;

    if (!token) return res.error({ status: 401, message: "Unauthorized." });

    const decodedToken = jwt.verify(token, process.env.JWT_SECRECT);

    const user = await User.findById(decodedToken?.userId).select("-password");

    if (!user) return res.error({ status: 404, message: "Account not found." });

    req.user = user;

    next();
  } catch (error) {
    console.log("🚀 ~ strictVerification middleware:", error);

    res.error({ status: 500, error });
  }
};

export default strictVerifcation;
