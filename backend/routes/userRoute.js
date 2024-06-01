import express from "express";
import {
  freezeAccount,
  getUser,
  updateUser,
} from "../controllers/userController.js";
import strictVerification from "../middlewares/strictVerification.js";

const router = express.Router();

// POST Requests

// GET Requests
router.get("/profile", getUser);

// PUT Requests
router.put("/update", strictVerification, updateUser);
router.put("/freeze", strictVerification, freezeAccount);

// DELETE Requests

export default router;
