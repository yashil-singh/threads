import express from "express";
import {
  login,
  signup,
  logout,
  checkSession,
  google,
  googleSuccess,
  googleFail,
} from "../controllers/authController.js";
import strictVerifcation from "../middlewares/strictVerification.js";
import passport from "passport";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);

router.get("/check-session", strictVerifcation, checkSession);
// router.get("/google", google);
router.get(
  "/google/callback",
  passport.authenticate("google", {
    // successRedirect: process.env.CLIENT_URL,
    failureRedirect: `${process.env.CLIENT_URL}login`,
  }),
  google
);
router.post("/google/success/:username", googleSuccess);
router.post("/google/fail", googleFail);

export default router;
