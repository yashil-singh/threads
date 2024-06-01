import express from "express";
import dotenv from "dotenv";
import { connectDb } from "./database/connectDb.js";
import cookieParser from "cookie-parser";
import responseMiddleware from "./middlewares/responseMiddleware.js";
import userRoute from "./routes/userRoute.js";
import authRoute from "./routes/authRoute.js";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000;

// Database Connection
connectDb();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Custom Response Middleware
app.use(responseMiddleware);

// Routes
app.use("/api/auth", authRoute);
app.use("/api/user", userRoute);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}.`);
});
