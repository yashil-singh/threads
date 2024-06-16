import express from "express";
import {
  getNotifications,
  readAllNotifications,
} from "../controllers/notificationController.js";
import strictVerifcation from "../middlewares/strictVerification.js";

const router = express.Router();

router.get("/", strictVerifcation, getNotifications);
router.put("/", strictVerifcation, readAllNotifications);

export default router;
