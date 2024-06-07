import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDb } from "./database/connectDb.js";
import cookieParser from "cookie-parser";
import responseMiddleware from "./middlewares/responseMiddleware.js";
import userRoute from "./routes/userRoute.js";
import authRoute from "./routes/authRoute.js";
import postRoute from "./routes/postRoute.js";
import { v2 as cloudinary } from "cloudinary";
import passportUtil from "./utils/passport.js";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000;

// Database Connection
connectDb();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRECT,
});

const corsOptions = {
  origin: true,
  credentials: true, // Allow credentials (cookies) to be sent
};

// Middlewares
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors(corsOptions));
passportUtil(app);

// Custom Response Middleware
app.use(responseMiddleware);

// Routes
app.use("/api/auth", authRoute);
app.use("/api/user", userRoute);
app.use("/api/post", postRoute);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}.`);
});
