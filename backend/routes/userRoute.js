import express from "express";
import {
  deleteAccount,
  freezeAccount,
  getFollowers,
  getFollowing,
  getFollowRequests,
  getSuggestedUsers,
  getUser,
  removeFollower,
  toggleFollow,
  toggleRequest,
  updateUser,
} from "../controllers/userController.js";
import strictVerification from "../middlewares/strictVerification.js";

const router = express.Router();

// POST Requests
router.post("/toggle-follow/:id", strictVerification, toggleFollow);
router.post("/toggle-request/:id", strictVerification, toggleRequest);

// GET Requests
router.get("/profile/:query", getUser);
router.get("/followers", strictVerification, getFollowers);
router.get("/following", strictVerification, getFollowing);
router.get("/requests", strictVerification, getFollowRequests);
router.get("/suggested", strictVerification, getSuggestedUsers);

// PUT Requests
router.put("/update", strictVerification, updateUser);
router.put("/freeze", strictVerification, freezeAccount);

// DELETE Requests
router.delete("/follower/:id", strictVerification, removeFollower);
router.delete("/", strictVerification, deleteAccount);

export default router;
